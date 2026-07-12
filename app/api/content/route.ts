import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const section = searchParams.get('section')

  try {
    const dbPath = path.join(process.cwd(), 'data', 'db.json')
    const seedPath = path.join(process.cwd(), 'data', 'seed.json')

    let data
    try {
      const dbData = await fs.readFile(dbPath, 'utf-8')
      data = JSON.parse(dbData)
    } catch {
      const seedData = await fs.readFile(seedPath, 'utf-8')
      data = JSON.parse(seedData)
    }

    if (section) {
      return NextResponse.json(data[section] || {})
    }
    return NextResponse.json(data)
  } catch (error) {
    console.error('[API Read error]:', error)
    return NextResponse.json({ error: 'Failed to read' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('[API] Starting publish process')

    const githubToken = process.env.GITHUB_TOKEN
    const githubRepo = process.env.GITHUB_REPO
    const githubBranch = process.env.GITHUB_BRANCH || 'main'

    console.log('[API] Environment check:', {
      hasGithubToken: !!githubToken,
      tokenStartsWith: githubToken?.substring(0, 10) + '...',
      githubRepo: githubRepo,
      githubBranch: githubBranch
    })

    if (!githubToken || !githubRepo) {
      return NextResponse.json({
        error: 'GitHub credentials not configured',
        hasToken: !!githubToken,
        hasRepo: !!githubRepo
      }, { status: 500 })
    }

    const url = `https://api.github.com/repos/${githubRepo}/contents/data/seed.json?ref=${githubBranch}`
    console.log('[API] Fetching from:', url)

    const getResponse = await fetch(url, {
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    })

    console.log('[API] GitHub response status:', getResponse.status, getResponse.statusText)

    if (!getResponse.ok) {
      const errorText = await getResponse.text()
      console.error('[API] GitHub API error:', {
        status: getResponse.status,
        statusText: getResponse.statusText,
        body: errorText
      })
      return NextResponse.json({
        error: 'Failed to fetch current seed.json from GitHub',
        githubStatus: getResponse.status,
        githubError: errorText
      }, { status: 500 })
    }

    const currentFile = await getResponse.json()
    const currentContent = Buffer.from(currentFile.content, 'base64').toString('utf-8')
    let currentData: Record<string, unknown>
    try {
      currentData = JSON.parse(currentContent)
    } catch (parseErr) {
      console.error('[API] Failed to parse current seed.json content:', {
        error: parseErr,
        contentPreview: currentContent.substring(0, 200),
      })
      return NextResponse.json({
        error: 'Failed to parse existing seed.json',
        details: parseErr instanceof Error ? parseErr.message : 'Parse error',
      }, { status: 500 })
    }

    const source = body.data || body
    const merged = { ...currentData, ...source }
    const cleanedData = Object.fromEntries(
      Object.entries(merged).filter(([key]) => key !== 'password' && key !== 'data')
    )
    const newContent = JSON.stringify(cleanedData, null, 2)
    const newContentBase64 = Buffer.from(newContent).toString('base64')

    const commitResponse = await fetch(
      `https://api.github.com/repos/${githubRepo}/contents/data/seed.json`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: 'Update portfolio content via admin panel',
          content: newContentBase64,
          sha: currentFile.sha,
          branch: githubBranch,
        })
      }
    )

    if (!commitResponse.ok) {
      const errorText = await commitResponse.text()
      console.error('[API] GitHub PUT (commit) failed:', {
        status: commitResponse.status,
        statusText: commitResponse.statusText,
        body: errorText,
      })
      return NextResponse.json({
        error: 'Failed to commit to GitHub',
        githubStatus: commitResponse.status,
        githubError: errorText,
      }, { status: 500 })
    }

    const commitResult = await commitResponse.json()
    console.log('[API] Successfully committed to GitHub:', commitResult.commit?.sha)

    return NextResponse.json({
      success: true,
      message: 'Changes committed to GitHub. Vercel will redeploy automatically.',
      commitSha: commitResult.commit?.sha,
    })
  } catch (error) {
    console.error('[API] Publish error:', error)
    return NextResponse.json({
      error: 'Failed to publish',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

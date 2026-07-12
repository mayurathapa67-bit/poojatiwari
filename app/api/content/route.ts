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
  let getResponse: Response | undefined
  let commitResponse: Response | undefined

  try {
    const body = await request.json()

    console.log('[API] Environment check:', {
      hasGithubToken: !!process.env.GITHUB_TOKEN,
      githubRepo: process.env.GITHUB_REPO,
      githubBranch: process.env.GITHUB_BRANCH || 'main',
      bodyKeys: Object.keys(body),
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
    })

    const githubToken = process.env.GITHUB_TOKEN
    const githubRepo = process.env.GITHUB_REPO
    const githubBranch = process.env.GITHUB_BRANCH || 'main'

    if (!githubToken) {
      console.error('[API] Missing GITHUB_TOKEN environment variable')
      return NextResponse.json({
        error: 'GitHub credentials not configured',
        details: 'GITHUB_TOKEN is not set. Add it to your environment variables.',
        missing: ['GITHUB_TOKEN']
      }, { status: 500 })
    }

    if (!githubRepo) {
      console.error('[API] Missing GITHUB_REPO environment variable')
      return NextResponse.json({
        error: 'GitHub credentials not configured',
        details: 'GITHUB_REPO is not set. Add it as owner/repo format.',
        missing: ['GITHUB_REPO']
      }, { status: 500 })
    }

    const repoUrl = `https://api.github.com/repos/${githubRepo}/contents/data/seed.json?ref=${githubBranch}`
    console.log('[API] Fetching current seed.json from GitHub:', { repo: githubRepo, branch: githubBranch })

    getResponse = await fetch(
      repoUrl,
      {
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'portfolio-admin',
        }
      }
    )

    if (!getResponse.ok) {
      const errorText = await getResponse.text()
      console.error('[API] GitHub GET failed:', {
        status: getResponse.status,
        statusText: getResponse.statusText,
        body: errorText,
        url: repoUrl.replace(githubToken, '***'),
      })
      return NextResponse.json({
        error: 'Failed to fetch current seed.json from GitHub',
        details: `GitHub API returned ${getResponse.status} ${getResponse.statusText}`,
        githubStatus: getResponse.status,
        githubError: errorText,
      }, { status: 500 })
    }

    const currentFile = await getResponse.json()
    console.log('[API] Got current seed.json from GitHub:', {
      sha: currentFile.sha,
      size: currentFile.size,
    })

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

    const commitUrl = `https://api.github.com/repos/${githubRepo}/contents/data/seed.json`
    console.log('[API] Committing updated seed.json to GitHub:', {
      branch: githubBranch,
      sha: currentFile.sha,
      contentSize: newContent.length,
    })

    commitResponse = await fetch(
      commitUrl,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'portfolio-admin',
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
        url: commitUrl,
        sha: currentFile.sha,
        branch: githubBranch,
      })
      return NextResponse.json({
        error: 'Failed to commit to GitHub',
        details: `GitHub API returned ${commitResponse.status} ${commitResponse.statusText}`,
        githubStatus: commitResponse.status,
        githubError: errorText,
      }, { status: 500 })
    }

    const commitResult = await commitResponse.json()
    console.log('[API] Successfully committed to GitHub:', {
      sha: commitResult.commit?.sha,
      htmlUrl: commitResult.commit?.html_url,
      message: commitResult.commit?.message,
    })

    return NextResponse.json({
      success: true,
      message: 'Changes committed to GitHub. Vercel will redeploy automatically.',
      commitSha: commitResult.commit?.sha,
    })
  } catch (error) {
    console.error('[API] Publish error (unexpected):', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      getStatus: getResponse?.status,
      getStatusText: getResponse?.statusText,
      commitStatus: commitResponse?.status,
      commitStatusText: commitResponse?.statusText,
    })
    return NextResponse.json({
      error: 'Failed to publish',
      details: error instanceof Error ? error.message : 'Unknown error',
      ...(getResponse ? { getStatus: getResponse.status } : {}),
      ...(commitResponse ? { commitStatus: commitResponse.status } : {}),
    }, { status: 500 })
  }
}

# GitHub API Auto-Commit Setup

The admin panel now uses the **GitHub API** to commit content changes directly to your repository. When `data/seed.json` changes on the default branch, Vercel automatically redeploys the site.

## Step 1: Create a GitHub Personal Access Token

1. Go to **GitHub Settings → Developer settings → Personal access tokens → Fine-grained tokens**
   - Or: <https://github.com/settings/tokens?type=beta>
2. Click **"Generate new token"**
3. Set these values:
   - **Token name**: `portfolio-admin`
   - **Expiration**: Select a reasonable expiry (e.g. 90 days or "No expiration")
   - **Repository access**: "Only select repositories" → select your portfolio repo
4. Under **Repository permissions**, set:
   - **Contents**: `Read and write` (required to read/update `data/seed.json`)
5. Click **"Generate token"** and **copy the token** — you won't see it again!

## Step 2: Add Environment Variables

### Local development (`.env.local`)

Add these to your `.env.local` file:

```env
GITHUB_TOKEN=github_pat_xxxxxxxxxxxx
GITHUB_REPO=your-username/your-repo-name
GITHUB_BRANCH=main
```

### Vercel Production

1. Go to your Vercel project dashboard → **Settings** → **Environment Variables**
2. Add the following variables:

| Name | Value |
|------|-------|
| `GITHUB_TOKEN` | The Personal Access Token from Step 1 |
| `GITHUB_REPO` | `your-username/your-repo-name` |
| `GITHUB_BRANCH` | `main` (or your default branch name) |

3. Redeploy your project (or the next deployment will pick them up).

## How It Works

1. **Admin saves content** → `POST /api/content` sends all sections to the API
2. **API fetches current `seed.json`** from GitHub (to get the latest `sha`)
3. **API merges the new data** with existing content
4. **API commits the updated `seed.json`** back to the repository with the message: `"Update portfolio content via admin panel"`
5. **Vercel detects the change** on the default branch and automatically redeploys (usually within 1-2 minutes)

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| "GitHub credentials not configured" | Missing `GITHUB_TOKEN` or `GITHUB_REPO` | Check env variables are set |
| "Failed to fetch current seed.json" | Token lacks read access or repo is wrong | Verify token permissions and repo name |
| "Failed to commit to GitHub" | Token lacks write access or `sha` mismatch | Check Contents permission is "Read and write" |
| Vercel doesn't redeploy | Branch mismatch or deploy hook not set | Ensure `GITHUB_BRANCH` matches your Vercel production branch |

## Removing the Old Edge Config

The old Vercel Edge Config integration has been fully replaced. You can safely:

1. Delete the Edge Config resource from your Vercel dashboard
2. Remove `EDGE_CONFIG` and `EDGE_CONFIG_TOKEN` from Vercel env vars (if present)
3. The `@vercel/edge-config` npm dependency has been removed from `package.json`

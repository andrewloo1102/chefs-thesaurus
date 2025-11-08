# Chef's Thesaurus Deployment Guide

This guide walks through shipping the deterministic Next.js site to Vercel. Remote MCP deployment is intentionally deferred; the local stdio server covers the demo story for V1.

## Prerequisites

- Vercel account (free tier is fine)
- GitHub repository up to date
- Node.js 20+ on your machine

## 1. Prepare the project

```bash
npm install
npm run test:golden
npm run validate
cd apps/web-nextjs
npm run build
cd ..\..
```

Ensure all changes are committed: `git status` should be clean.

## 2. Deploy with Vercel CLI (recommended)

```bash
npm install -g vercel
vercel login
cd C:\Users\andre\Documents\Projects\chefs-thesaurus
vercel --prod
```

Prompt checklist:
- “Link to existing project?” → Yes (if already linked) or No → create new
- “Which scope?” → Choose your personal account
- “Link to which directory?” → `apps/web-nextjs`
- “Configure as Next.js?” → Accept defaults

## 3. Verify the deployment

1. Visit the generated URL (e.g., `https://chefs-thesaurus.vercel.app`).
2. Run the four golden cases to ensure outputs match local expectations.
3. Hit the API directly: `curl https://chefs-thesaurus.vercel.app/api/substitute` with the butter example from LOCAL_TESTING.md.

## 4. Optional dashboard workflow

If you prefer the UI:
1. Go to [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **Add New… → Project**
3. Import `andrewloo1102/chefs-thesaurus`
4. Set **Root Directory** to `apps/web-nextjs`
5. Deploy

## 5. MCP reminder

- Keep Claude Desktop pointed at the local stdio command (`npx -y tsx apps/mcp-server/src/index.ts`).
- `apps/mcp-server/src/remote.ts` remains for future exploration but is not part of the deployment story.
- Mention remote MCP only as future work when discussing roadmap.

## 6. Troubleshooting

| Issue | Fix |
| --- | --- |
| Build fails on Vercel | Run `npm run build` locally inside `apps/web-nextjs` to reproduce; check Next.js logs. |
| Wrong directory error | Re-run `vercel --prod` and choose `apps/web-nextjs` when prompted. |
| Env variables | None required for V1. |
| Old assets served | Deploy again or use `vercel --prod --force`. |

## 7. After deployment

- Update README.md (already links to the live site) if the URL changes.
- Record or share the Loom demo using `docs/DEMO_SCRIPT.md`.
- Create a short changelog entry if you iterate further.


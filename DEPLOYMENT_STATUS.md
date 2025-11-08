# Chef's Thesaurus - Deployment Status

## Current Status ✅

### Completed
1. **GitHub backup** - Latest changes pushed to `main`
2. **Next.js site** - Runs cleanly in dev and prod build (Next 14.2.0 + React 18)
3. **Vercel setup** - Project root `apps/web-nextjs` confirmed
4. **Local MCP server** - Verified through Claude Desktop

### Build status
- ✅ Development: `npm run dev`
- ✅ Production: `npm run build`
- ℹ️ Remote MCP deployment: deferred to future version

## Deploying the web app

```bash
npm install -g vercel
vercel login
cd C:\Users\andre\Documents\Projects\chefs-thesaurus
vercel --prod
```

When prompted, choose `apps/web-nextjs` as the project directory. Re-deploys reuse that setting automatically.

## Post-deploy checks

1. Open the production URL (e.g., https://chefs-thesaurus.vercel.app)
2. Run the four golden cases and confirm results match local behavior
3. Spot-check `/api/substitute` with `curl` or the built-in browser dev tools

## MCP note

- V1 only advertises the local stdio MCP server.
- `apps/mcp-server/src/remote.ts` is retained as a future experiment but is not wired into production.
- Mention a remote MCP endpoint as an “optional future enhancement” in documentation if needed.

## Related files

- `DEPLOYMENT.md` – detailed CLI + dashboard walkthrough
- `docs/DEMO_SCRIPT.md` – live demo steps (local MCP)
- `apps/web-nextjs/next.config.js` – production build settings
- `test-local.js` – smoke test run prior to deployment


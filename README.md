# Chef's Thesaurus

Chef's Thesaurus is a deterministic substitution reference that delivers precise, pre-validated ingredient swaps with friendly UI polish. A local MCP (Model Context Protocol) server mirrors the same logic so AI assistants can retrieve the exact answers you see in the app.

## Links

- Live site: https://chefs-thesaurus.vercel.app
- Loom demo: _Coming soon_
- Architecture: docs/ARCHITECTURE.md
- Demo script (local MCP): docs/DEMO_SCRIPT.md
- GitHub: https://github.com/andrewloo1102/chefs-thesaurus

## Why deterministic substitutions

- All ratios are hand-curated and stored in versioned JSON, so the UI never hallucinates measurements.
- Golden tests lock in expected quantities for representative cases (e.g., sour cream → Greek yogurt) and fail fast if data drifts.

## What MCP adds

- Claude (or any MCP-aware client) can call the same substitution engine for consistent answers during live interviews or demos.
- The local server exposes `search_substitution` and `describe_effects`, enabling scripted walkthroughs without touching the browser.

## Run locally

### Web app (Next.js)

```bash
npm install
npm run dev
# visit http://localhost:3000
```

### MCP server (stdio)

```bash
npm install
npm -w apps/mcp-server run dev
# point Claude Desktop to npx -y tsx apps/mcp-server/src/index.ts
```

See docs/DEMO_SCRIPT.md for a full end-to-end walkthrough, including Claude configuration and golden case prompts.

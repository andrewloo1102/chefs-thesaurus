# Local Testing Guide - Chef's Thesaurus

This guide walks through verifying the deterministic dataset, the Next.js UI, and the local MCP server before sharing the project.

## Prerequisites

- Node.js 20+
- Git configured
- Run `npm install` once at the repository root

## Quick smoke test

```bash
node test-local.js
```

The script runs golden cases, validates data, and pings the consolidated API.

## Manual testing checklist

### 1. Core logic

```bash
npm run test:golden       # deterministic substitution snapshots
npm run validate          # substitutions.json schema + ratio sanity checks
```

### 2. Web application

```bash
npm run dev               # launches http://localhost:3000
```

In the browser, confirm:
- Example chips populate the form
- Submissions hit `/api/substitute`
- Four golden cases render the expected cards (see outputs below)

### 3. MCP server (local stdio)

```bash
cd apps/mcp-server
npm run dev
```

Configure Claude Desktop with the JSON block in `docs/DEMO_SCRIPT.md`, then list tools and call `search_substitution` / `describe_effects`.

### 4. API endpoint

```bash
curl -X POST http://localhost:3000/api/substitute \
  -H "Content-Type: application/json" \
  -d '{
        "ingredient": "butter",
        "quantity": 4,
        "unit": "tbsp"
      }'
```

Expected JSON:

```json
{
  "supported": true,
  "base": "butter",
  "substitute": "Neutral oil",
  "quantity": 3,
  "unit": "tbsp",
  "basis": "volume",
  "notes": "Use 3/4 the amount of oil for butter.",
  "alts": [
    {
      "substitute": "Coconut oil (refined)",
      "ratioMultiplier": 1
    }
  ]
}
```

### 5. Production parity

```bash
cd apps/web-nextjs
npm run build
```

Next.js 14.2.0 with React 18 builds cleanly using the checked-in config.

## Golden case reference

| Case | Expected result |
| --- | --- |
| Sour cream, 1 cup | Greek yogurt (full-fat), 1 cup, note about sharper tang |
| Butter, 4 tbsp | Neutral oil, 3 tbsp, note about 3/4 ratio |
| Garlic clove, 2 unit | Garlic powder, 0.25 unit, note ≈1/8 tsp per clove |
| Crema agria, 1 cup | Greek yogurt (full-fat), 1 cup, same note as sour cream |

## Troubleshooting

- **Port already in use**: Next.js will offer `3001`; accept it and update the curl URL.
- **Claude cannot see tools**: Double-check the Windows paths and escape backslashes in `claude_desktop_config.json`.
- **TypeScript complaints**: Run `npm install` to ensure workspace dependencies match `package-lock.json`.
- **Slow dev server**: Close other Turbopack instances and restart.

## After local sign-off

1. Record or rehearse the Loom demo using docs/DEMO_SCRIPT.md.
2. Push the repo to GitHub if it is not already up-to-date.
3. Deploy (optional) via `vercel --prod` using `apps/web-nextjs` as the root.
4. Mention remote MCP as future work; V1 focuses on deterministic local demos.


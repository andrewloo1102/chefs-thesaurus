# Architecture Overview

```
[Figma design system]
        |
        v
Next.js UI (apps/web-nextjs/app/page.tsx)
        |
        v
HTTP POST /api/substitute (apps/web-nextjs/app/api/substitute/route.ts)
        |
        v
@chefs-thesaurus/core (packages/core/src/index.ts)
        |
        v
substitutions.json (packages/core/data/substitutions.json)

MCP Server (apps/mcp-server/src/index.ts)
        |
        v
@chefs-thesaurus/core
```

- UI atoms are pulled from Figma-inspired components (`apps/web-nextjs/components`).
- Both the web API and the MCP server call the same `searchSubstitutions` / `describeEffects` exports from `@chefs-thesaurus/core`.
- Data lives in a single JSON file that is bundled with both runtimes, keeping behavior deterministic.

## Data model: `substitutions.json`

Each entry looks like:

```json
{
  "base": "sour cream",
  "synonyms": ["crema agria"],
  "alternatives": [
    {
      "substitute": "Greek yogurt (full-fat)",
      "ratio": {
        "mode": "multiplier",
        "value": 1,
        "basis": "volume"
      },
      "notes": "Yogurt tang is slightly sharper than sour cream.",
      "tags": ["dairy"],
      "tips": ["Use full-fat for best match"],
      "allergens": ["milk"]
    }
  ]
}
```

- `ratio.mode` is always `"multiplier"` in V1.
- `ratio.value` is the factor applied to the input quantity.
- `ratio.basis` is either `"volume"` (cups, tbsp, etc.) or `"unit"` (whole items like cloves or eggs).

## API example (`POST /api/substitute`)

Request:

```bash
curl -X POST http://localhost:3000/api/substitute \
  -H "Content-Type: application/json" \
  -d '{
        "ingredient": "sour cream",
        "quantity": 1,
        "unit": "cup",
        "dish": "Cakes"
      }'
```

Response:

```json
{
  "base": "sour cream",
  "supported": true,
  "substitute": "Greek yogurt (full-fat)",
  "quantity": 1,
  "unit": "cup",
  "basis": "volume",
  "notes": "Yogurt tang is slightly sharper than sour cream.",
  "alts": [
    {
      "substitute": "Crème fraîche",
      "ratioMultiplier": 1
    }
  ]
}
```

The MCP server returns the same information wrapped in the MCP tool response format.

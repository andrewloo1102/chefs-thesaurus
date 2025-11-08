# Local MCP Demo Script

Use this script to show Chef's Thesaurus running entirely on your machine with Claude (or another MCP client).

## 1. Start the MCP server

```bash
npm install
npm -w apps/mcp-server run dev
```

- The command runs `npx -y tsx apps/mcp-server/src/index.ts` under the hood.
- You should see `Chef's Thesaurus MCP server running on stdio` in the terminal.

## 2. Point Claude Desktop at the server

Open `c:\Users\andre\AppData\Roaming\Claude\claude_desktop_config.json` and set one of the following blocks.

**Development (tsx runner)**
```json
{
  "mcpServers": {
    "chefs-thesaurus": {
      "command": "npx",
      "args": [
        "-y",
        "tsx",
        "C:\\Users\\andre\\Documents\\Projects\\chefs-thesaurus\\apps\\mcp-server\\src\\index.ts"
      ]
    }
  }
}
```

**Start after building (optional)**
```json
{
  "mcpServers": {
    "chefs-thesaurus": {
      "command": "node",
      "args": [
        "C:\\Users\\andre\\Documents\\Projects\\chefs-thesaurus\\apps\\mcp-server\\dist\\index.js"
      ]
    }
  }
}
```

Restart Claude Desktop after editing the file. The tools palette should show:
- `search_substitution`
- `describe_effects`

## 3. Demo flow (prompts)

1. "Find a substitute for 1 cup of sour cream."
2. "Explain the effects of using Greek yogurt instead of sour cream in cakes."
3. "Find a substitute for 4 tbsp butter."
4. "Find a substitute for 2 garlic cloves."

## 4. Golden outputs

| Input | Expected substitute |
| --- | --- |
| Sour cream, 1 cup | Greek yogurt (full-fat), 1 cup, note about tang |
| Butter, 4 tbsp | Neutral oil, 3 tbsp, note about 3/4 ratio |
| Garlic clove, 2 unit | Garlic powder, 0.25 unit, note ~1/8 tsp per clove |
| Crema agria, 1 cup | Greek yogurt (full-fat), 1 cup, same note as sour cream |

For `describe_effects`, Claude summarizes the text from `@chefs-thesaurus/core` (deterministic strings).

## 5. Troubleshooting

- **Claude does not show the server**: Confirm the path in `claude_desktop_config.json` matches your checkout and use double backslashes on Windows.
- **`npx` not found**: Install Node.js 20+ and ensure it is on `PATH`; you can also run `npm -g install npx`.
- **Port conflicts**: The MCP server uses stdio, so no TCP ports are needed. Close any lingering terminal session if the tool list stops responding.
- **Node permission issues**: Open PowerShell as Administrator on locked-down machines.

Continue to docs/ARCHITECTURE.md for system context, and README.md for quick links.

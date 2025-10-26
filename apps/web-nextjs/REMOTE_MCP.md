# Remote MCP Server Setup

This document explains how to configure Claude Desktop to use the Chef's Thesaurus remote MCP server.

## What is the Remote MCP Server?

The remote MCP server allows Claude Desktop to connect to Chef's Thesaurus via HTTP instead of running it as a local process. This makes it accessible from anywhere and doesn't require local Node.js setup.

## Endpoint URL

Once deployed on Vercel, your MCP endpoint will be available at:

```
https://chefs-thesaurus.vercel.app/api/mcp
```

## Available Tools

The remote MCP server provides two tools:

1. **search_substitution**: Find cooking ingredient substitutions with precise measurements
2. **describe_effects**: Describe the effects of using a substitute ingredient

## Configuring Claude Desktop

### On Windows

1. Open Claude Desktop settings or manually edit the config file:
   ```
   %APPDATA%\Claude\claude_desktop_config.json
   ```

2. Add the following configuration:

```json
{
  "mcpServers": {
    "chefs-thesaurus-remote": {
      "url": "https://chefs-thesaurus.vercel.app/api/mcp",
      "method": "POST"
    }
  }
}
```

3. Restart Claude Desktop.

### On macOS

1. Open Claude Desktop settings or manually edit the config file:
   ```
   ~/Library/Application Support/Claude/claude_desktop_config.json
   ```

2. Add the configuration as shown above.

3. Restart Claude Desktop.

## Testing

After configuring Claude Desktop, test the MCP connection:

1. Open Claude Desktop.
2. Start a new conversation.
3. Ask: "Find a substitute for 1 cup of sour cream"
4. Claude should use the `search_substitution` tool and provide a response.

## Troubleshooting

### MCP not appearing in Claude Desktop

- Check that the URL is correct and accessible in a browser
- Verify that the config file syntax is valid JSON
- Restart Claude Desktop completely (quit and reopen)

### Tool calls failing

- Check Vercel function logs for errors
- Verify the endpoint is returning the expected JSON format
- Test the endpoint directly with curl:

```bash
curl -X POST https://chefs-thesaurus.vercel.app/api/mcp \
  -H "Content-Type: application/json" \
  -d '{"tool": "search_substitution", "args": {"ingredient": "butter"}}'
```

### Network errors

- Ensure your Vercel deployment is active
- Check that the endpoint URL doesn't have trailing slashes
- Verify firewall/proxy settings aren't blocking the connection

## Local Development

For local testing, you can use `localhost`:

```json
{
  "mcpServers": {
    "chefs-thesaurus-local": {
      "url": "http://localhost:3000/api/mcp",
      "method": "POST"
    }
  }
}
```

Then run `npm run dev` in the `apps/web-nextjs` directory.

## Notes

- The remote MCP endpoint is serverless and scales automatically
- Both local and remote MCP servers can be configured simultaneously in Claude Desktop
- The remote server uses the same core logic as the web app

# Setting Up Chef's Thesaurus MCP in Claude Desktop

## Step 1: Build the MCP Server

```bash
cd apps/mcp-server
npm run build
```

## Step 2: Configure Claude Desktop

### Windows

1. Open the Claude Desktop config file:
   ```
   %APPDATA%\Claude\claude_desktop_config.json
   ```
   
2. Add this configuration:
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

### Alternative: Development Mode (using tsx)

For development, you can use tsx directly without building:

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

## Step 3: Restart Claude Desktop

Completely quit and restart Claude Desktop for changes to take effect.

## Step 4: Test the Tools

In Claude Desktop, try these prompts:

1. **Basic substitution:**
   ```
   What can I substitute for 1 cup of butter?
   ```

2. **With quantity:**
   ```
   I need 2 garlic cloves but only have garlic powder. How much should I use?
   ```

3. **With context:**
   ```
   I'm making cookies and need to substitute 4 tablespoons of butter. What are my options?
   ```

4. **Describe effects:**
   ```
   How will using Greek yogurt instead of sour cream affect my dish?
   ```

5. **Find stores:**
   ```
   Where can I find almond flour near coordinates 40.7128, -74.0060?
   ```

## Available Tools

Claude will have access to three tools:

1. **search_substitution** - Find ingredient substitutes with calculated amounts
2. **describe_effects** - Understand how substitutions affect your dish
3. **lookup_stores** - Find nearby stores carrying ingredients

## Troubleshooting

If the tools don't appear in Claude Desktop:

1. Check the config file is valid JSON
2. Verify the file path is correct (use forward slashes or escaped backslashes)
3. Restart Claude Desktop completely
4. Check Claude Desktop logs at:
   ```
   %APPDATA%\Claude\logs\mcp.log
   ```

## Supported Ingredients

20 ingredients including:
- butter, eggs, sour cream, milk, heavy cream, buttermilk
- all-purpose flour, sugar, cornstarch, baking powder
- garlic clove, fresh ginger, fresh basil, fresh herbs
- wine, mirin, shaoxing wine, rice vinegar
- tomato paste, lemon juice


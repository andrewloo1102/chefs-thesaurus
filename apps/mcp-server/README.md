# Chef's Thesaurus MCP Server

Model Context Protocol (MCP) server that exposes cooking substitution tools to AI assistants like Claude Desktop.

## Tools Provided

### 1. `search_substitution`
Find ingredient substitutions with precise measurements.

**Arguments:**
- `ingredient` (required): Ingredient to substitute
- `quantity` (optional): Amount
- `unit` (optional): Unit (tsp, tbsp, cup, ml, g, unit)
- `dish` (optional): Dish type for context

**Example:**
```json
{
  "ingredient": "butter",
  "quantity": 4,
  "unit": "tbsp"
}
```

**Returns:**
- Substitute ingredient
- Calculated quantity with proper ratio
- Notes and tips
- Alternative substitutes

### 2. `describe_effects`
Describe how a substitution affects the final dish.

**Arguments:**
- `base` (required): Original ingredient
- `substitute` (required): Substitute ingredient
- `dish` (optional): Dish type

**Returns:**
- Summary of texture, flavor, or appearance changes

### 3. `lookup_stores`
Find nearby stores carrying an ingredient.

**Arguments:**
- `query` (required): Ingredient name
- `lat` (required): Latitude
- `lon` (required): Longitude
- `radius_m` (optional): Search radius in meters

**Returns:**
- List of stores with distances

## Setup in Claude Desktop

### Local MCP Server (Development)

Add to your Claude Desktop config file:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

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

Or for development (using tsx):
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

### Remote MCP Server (Production)

For the deployed version, use the remote URL:

```json
{
  "mcpServers": {
    "chefs-thesaurus": {
      "url": "https://your-app.vercel.app/api/mcp/sse"
    }
  }
}
```

## Usage

Once configured in Claude Desktop, you can ask:

- "What can I substitute for butter in cookies?"
- "I need 2 cups of sour cream but only have yogurt, what do I do?"
- "Find stores near me that sell garlic powder"

## Development

```bash
# Run in dev mode
npm run dev

# Build for production
npm run build

# Run built version
npm start
```

## Supported Ingredients

20+ ingredients including:
- Dairy: butter, sour cream, heavy cream, milk, buttermilk
- Baking: eggs, flour, sugar, baking powder, cornstarch
- Aromatics: garlic clove, fresh ginger, fresh basil, fresh herbs
- Liquids: wine, mirin, shaoxing wine, lemon juice, vinegar
- And more!


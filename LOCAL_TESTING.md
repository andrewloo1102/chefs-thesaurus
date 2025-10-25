# Local Testing Guide - Chef's Thesaurus

This guide helps you test all components locally before deploying to Vercel.

## Prerequisites

- Node.js 18+ installed
- Git configured
- All dependencies installed: `npm install`

## Quick Start

Run the automated test suite:
```bash
node test-local.js
```

## Manual Testing Steps

### 1. Core Logic Testing

Test the core substitution logic:
```bash
# Run golden tests
npm run test:golden

# Validate data
npm run validate
```

### 2. Web Application Testing

Start the Next.js development server:
```bash
npm run dev
```

This will start the web app on `http://localhost:3000` (or 3001 if 3000 is busy).

**Test the web interface:**
- Open `http://localhost:3000`
- Try different ingredient substitutions
- Test the API endpoint directly: `POST http://localhost:3000/api/substitute`

### 3. MCP Server Testing

#### Local MCP Server (stdio transport)
```bash
cd apps/mcp-server
npm run build
npm run dev
```

This starts the MCP server for local Claude Desktop integration.

#### Remote MCP Server (HTTP/SSE transport)
```bash
cd apps/mcp-server
npm run dev:remote
```

This starts the MCP server with HTTP/SSE transport for remote access.

### 4. API Testing

Test the consolidated API endpoint:
```bash
curl -X POST http://localhost:3000/api/substitute \
  -H "Content-Type: application/json" \
  -d '{
    "ingredient": "butter",
    "quantity": 1,
    "unit": "cup",
    "dish": "baking"
  }'
```

Expected response:
```json
{
  "supported": true,
  "base": "butter",
  "substitute": "coconut oil",
  "quantity": 1,
  "unit": "cup",
  "basis": "volume",
  "effects": "...",
  "stores": []
}
```

### 5. Production Build Testing

Test the production build (ignores type errors):
```bash
cd apps/web-nextjs
npm run build
```

This should complete successfully with the current configuration.

## Testing Checklist

- [ ] Golden tests pass
- [ ] Data validation passes
- [ ] Web app loads and functions correctly
- [ ] API endpoints respond correctly
- [ ] MCP server builds successfully
- [ ] Production build completes (with type warnings)
- [ ] All substitution logic works as expected

## Troubleshooting

### Port Conflicts
If port 3000 is busy, Next.js will automatically use port 3001.

### Build Errors
If you encounter build errors:
1. Check that all dependencies are installed
2. Verify TypeScript configuration
3. The current setup ignores type errors for deployment

### MCP Server Issues
1. Ensure all dependencies are installed in `apps/mcp-server`
2. Check that the core package is built
3. Verify Claude Desktop configuration

## Local Development Workflow

1. **Start web app**: `npm run dev`
2. **Make changes** to code
3. **Test changes** in browser
4. **Run tests**: `node test-local.js`
5. **Commit changes**: `git add . && git commit -m "description"`
6. **Push to GitHub**: `git push origin main`

## Next Steps After Local Testing

Once everything works locally:
1. Deploy to Vercel: `vercel --prod`
2. Test deployed application
3. Configure remote MCP server
4. Update Claude Desktop configuration

## Environment Variables

For local testing, you don't need any environment variables. All functionality works with the default configuration.

## Performance Notes

- Development server uses Turbopack for faster builds
- Production build may take longer due to optimization
- MCP server runs efficiently in both stdio and HTTP modes


# Chef's Thesaurus Deployment Guide

This guide covers deploying the Chef's Thesaurus web app and remote MCP server to Vercel.

## Prerequisites

- Vercel account (free tier works)
- GitHub repository connected to Vercel
- Node.js 18+ installed locally

## Deployment Steps

### 1. Prepare for Deployment

Ensure all files are committed and pushed to GitHub:

```bash
git add .
git commit -m "feat: remote MCP server and Vercel config"
git push origin main
```

### 2. Deploy to Vercel

#### Option A: Vercel CLI (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from project root:**
   ```bash
   vercel --prod
   ```

4. **Follow the prompts:**
   - Link to existing project or create new
   - Set root directory: `apps/web-nextjs`
   - Confirm build settings

#### Option B: Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Set root directory to `apps/web-nextjs`
5. Deploy

### 3. Configure Environment Variables

In Vercel dashboard, add any environment variables if needed:

- No environment variables required for basic functionality
- Optional: Add custom domain settings

### 4. Verify Deployment

1. **Test Web App:**
   - Visit your Vercel URL (e.g., `https://chefs-thesaurus.vercel.app`)
   - Test ingredient substitutions
   - Verify all functionality works

2. **Test MCP Server:**
   - Test the SSE endpoint: `https://your-app.vercel.app/api/mcp/sse`
   - Should return MCP server information

### 5. Configure Claude Desktop for Remote MCP

Once deployed, users can configure Claude Desktop to use the remote MCP server:

**Claude Desktop Config:**
```json
{
  "mcpServers": {
    "chefs-thesaurus": {
      "url": "https://your-app.vercel.app/api/mcp/sse"
    }
  }
}
```

**File locations:**
- **Windows:** `%APPDATA%\\Claude\\claude_desktop_config.json`
- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`

## Architecture After Deployment

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Web Users     │    │   Vercel         │    │   Shared Core   │
│   (Browser)     │◄──►│   (Next.js App)  │◄──►│   (packages/)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
┌─────────────────┐    ┌──────────────────┐
│   Claude Users  │    │   MCP SSE        │
│   (Desktop)     │◄──►│   (/api/mcp/sse) │
└─────────────────┘    └──────────────────┘
```

## Features Available

### Web App (Browser)
- Ingredient substitution search
- Quantity calculations
- Store lookup
- Responsive design
- Real-time results

### MCP Server (Claude Desktop)
- `search_substitution` tool
- `describe_effects` tool  
- `lookup_stores` tool
- Rich formatted responses

## Troubleshooting

### Build Issues
- Ensure `apps/web-nextjs/package.json` has correct build scripts
- Check that all dependencies are installed
- Verify TypeScript compilation

### MCP Server Issues
- Test SSE endpoint directly: `curl https://your-app.vercel.app/api/mcp/sse`
- Check Vercel function logs
- Verify CORS headers are set

### Claude Desktop Issues
- Restart Claude Desktop after config changes
- Check config file syntax (valid JSON)
- Verify URL is accessible

## Custom Domain (Optional)

1. In Vercel dashboard, go to Project Settings
2. Add your custom domain
3. Update Claude Desktop config with new URL
4. Update any documentation with new domain

## Monitoring

- **Vercel Analytics:** Built-in performance monitoring
- **Function Logs:** Check Vercel dashboard for errors
- **Usage Stats:** Monitor API calls and performance

## Updates

To update the deployment:

1. Make changes locally
2. Commit and push to GitHub
3. Vercel automatically redeploys
4. No manual intervention needed

## Support

- **Web App Issues:** Check browser console and Vercel logs
- **MCP Issues:** Test SSE endpoint and check Claude Desktop logs
- **General Issues:** Review this documentation and Vercel docs


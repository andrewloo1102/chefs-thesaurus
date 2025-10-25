#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Chef\'s Thesaurus Local Environment');
console.log('===============================================\n');

// Start Next.js dev server
console.log('🌐 Starting Next.js development server...');
const nextjs = spawn('npm', ['run', 'dev'], {
  cwd: process.cwd(),
  stdio: 'inherit',
  shell: true
});

// Wait a moment for Next.js to start
setTimeout(() => {
  console.log('\n📡 Starting MCP server...');
  
  // Start MCP server
  const mcp = spawn('npm', ['run', 'dev'], {
    cwd: path.join(process.cwd(), 'apps/mcp-server'),
    stdio: 'inherit',
    shell: true
  });
  
  console.log('\n✅ All services started!');
  console.log('\n📋 Available Services:');
  console.log('   🌐 Web App: http://localhost:3000 (or 3001)');
  console.log('   📡 MCP Server: Running on stdio transport');
  console.log('   🔧 API Endpoint: http://localhost:3000/api/substitute');
  console.log('\n💡 Press Ctrl+C to stop all services');
  
}, 3000);

// Handle cleanup
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping all services...');
  nextjs.kill();
  process.exit(0);
});


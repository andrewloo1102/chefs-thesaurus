#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🧪 Testing Local MCP Server');
console.log('============================\n');

// Test the local MCP server
function testLocalMCPServer() {
  console.log('🔍 Testing local MCP server...');
  
  const mcpProcess = spawn('npx', ['tsx', 'src/index.ts'], {
    cwd: path.join(process.cwd(), 'apps/mcp-server'),
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  // Send a test request
  const testRequest = {
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/list',
    params: {}
  };
  
  mcpProcess.stdin.write(JSON.stringify(testRequest) + '\n');
  
  let output = '';
  let error = '';
  
  mcpProcess.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  mcpProcess.stderr.on('data', (data) => {
    error += data.toString();
  });
  
  mcpProcess.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Local MCP server test completed');
      if (output) {
        console.log('📤 Output:', output);
      }
    } else {
      console.log('❌ Local MCP server test failed');
      if (error) {
        console.log('📤 Error:', error);
      }
    }
  });
  
  // Kill the process after 5 seconds
  setTimeout(() => {
    mcpProcess.kill();
  }, 5000);
}

// Run the test
testLocalMCPServer();

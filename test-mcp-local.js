#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

const isWindows = process.platform === 'win32';
const command = isWindows ? 'cmd.exe' : 'npx';
const args = isWindows
  ? ['/c', 'npx', '-y', 'tsx', 'src/index.ts']
  : ['-y', 'tsx', 'src/index.ts'];

console.log('🧪 Testing Local MCP Server');
console.log('============================\n');

// Test the local MCP server
function testLocalMCPServer() {
  console.log('🔍 Testing local MCP server...');
  
  const mcpProcess = spawn(command, args, {
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
  
  mcpProcess.on('close', (code, signal) => {
    const terminatedByTimer = signal === 'SIGTERM' || signal === 'SIGKILL';

    if (code === 0 || terminatedByTimer) {
      console.log('✅ Local MCP server test completed');
      if (output.trim()) {
        console.log('📤 Output:', output);
      }
      if (error.trim()) {
        console.log('ℹ️  Stderr:', error);
      }
    } else {
      console.log('❌ Local MCP server test failed');
      if (error.trim()) {
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

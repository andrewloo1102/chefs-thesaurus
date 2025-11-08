#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Chef\'s Thesaurus - Local Testing Environment');
console.log('===============================================\n');

// Test configurations
const tests = [
  {
    name: 'Golden Tests',
    command: 'npm',
    args: ['run', 'test:golden'],
    cwd: process.cwd(),
    description: 'Run core substitution logic tests'
  },
  {
    name: 'Data Validation',
    command: 'npm',
    args: ['run', 'validate'],
    cwd: process.cwd(),
    description: 'Validate substitutions.json data'
  },
  {
    name: 'MCP Server Smoke Test',
    command: 'node',
    args: ['test-mcp-local.js'],
    cwd: process.cwd(),
    description: 'Start stdio MCP server and list tools'
  },
  {
    name: 'Next.js Build Test',
    command: 'npm',
    args: ['run', 'build'],
    cwd: path.join(process.cwd(), 'apps/web-nextjs'),
    description: 'Test production build (may have type warnings)'
  }
];

// Run tests sequentially
async function runTests() {
  let allPassed = true;
  
  for (const test of tests) {
    console.log(`\n🔍 Running: ${test.name}`);
    console.log(`   ${test.description}`);
    console.log(`   Command: ${test.command} ${test.args.join(' ')}`);
    console.log(`   Directory: ${test.cwd}`);
    
    try {
      const result = await runCommand(test.command, test.args, test.cwd);
      if (result.success) {
        console.log(`✅ ${test.name}: PASSED`);
      } else {
        console.log(`❌ ${test.name}: FAILED`);
        console.log(`   Error: ${result.error}`);
        allPassed = false;
      }
    } catch (error) {
      console.log(`❌ ${test.name}: ERROR`);
      console.log(`   ${error.message}`);
      allPassed = false;
    }
  }
  
  console.log('\n' + '='.repeat(50));
  if (allPassed) {
    console.log('🎉 All tests passed! Your local environment is ready.');
  } else {
    console.log('⚠️  Some tests failed. Check the errors above.');
  }
  
  console.log('\n📋 Next Steps:');
  console.log('1. Start Next.js dev server: npm run dev');
  console.log('2. Start MCP server: cd apps/mcp-server && npm run dev');
  console.log('3. Test web app at: http://localhost:3000');
  console.log('4. Test MCP server locally with Claude Desktop');
}

function runCommand(command, args, cwd) {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd,
      stdio: 'pipe',
      shell: true
    });
    
    let stdout = '';
    let stderr = '';
    
    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve({ success: true, stdout, stderr });
      } else {
        resolve({ success: false, error: stderr || stdout, code });
      }
    });
    
    child.on('error', (error) => {
      resolve({ success: false, error: error.message });
    });
  });
}

// Start the tests
runTests().catch(console.error);

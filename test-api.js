#!/usr/bin/env node

const http = require('http');

console.log('🧪 Testing Chef\'s Thesaurus API');
console.log('=================================\n');

const testCases = [
  {
    name: 'Butter substitution',
    data: {
      ingredient: 'butter',
      quantity: 1,
      unit: 'cup',
      dish: 'baking'
    }
  },
  {
    name: 'Egg substitution',
    data: {
      ingredient: 'egg',
      quantity: 2,
      unit: 'unit',
      dish: 'baking'
    }
  },
  {
    name: 'Unsupported ingredient',
    data: {
      ingredient: 'unicorn tears',
      quantity: 1,
      unit: 'cup',
      dish: 'magic'
    }
  }
];

async function testAPI() {
  for (const testCase of testCases) {
    console.log(`\n🔍 Testing: ${testCase.name}`);
    
    try {
      const result = await makeRequest(testCase.data);
      console.log(`✅ ${testCase.name}: PASSED`);
      console.log(`   Response: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      console.log(`❌ ${testCase.name}: FAILED`);
      console.log(`   Error: ${error.message}`);
    }
  }
}

function makeRequest(data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/substitute',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve(parsed);
        } catch (error) {
          reject(new Error(`Invalid JSON response: ${responseData}`));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(new Error(`Request failed: ${error.message}`));
    });
    
    req.write(postData);
    req.end();
  });
}

// Check if server is running
console.log('🔍 Checking if server is running...');
makeRequest({ ingredient: 'test' })
  .then(() => {
    console.log('✅ Server is running! Starting tests...\n');
    testAPI();
  })
  .catch((error) => {
    console.log('❌ Server is not running or not accessible');
    console.log('   Error:', error.message);
    console.log('\n💡 Make sure to start the server first:');
    console.log('   npm run dev');
  });


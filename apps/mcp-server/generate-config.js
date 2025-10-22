#!/usr/bin/env node

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mcpServerPath = path.join(__dirname, 'dist', 'index.js');

const config = {
  mcpServers: {
    "chefs-thesaurus": {
      command: "node",
      args: [mcpServerPath]
    }
  }
};

console.log("\n=== Claude Desktop Config ===\n");
console.log("Add this to your Claude Desktop config file:\n");
console.log("Windows: %APPDATA%\\Claude\\claude_desktop_config.json");
console.log("macOS: ~/Library/Application Support/Claude/claude_desktop_config.json\n");
console.log(JSON.stringify(config, null, 2));
console.log("\n=============================\n");


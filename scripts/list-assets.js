import { execSync } from 'child_process';

// List what's in the cloned repo
console.log("=== REPO ROOT DIRS ===");
try {
  console.log(execSync('ls -la /tmp/gtarp-casino-assets/').toString());
} catch(e) {
  console.log("Repo not found, re-cloning...");
  execSync('git clone --depth 1 https://github.com/collin-labs/gtarp-casino-assets.git /tmp/gtarp-casino-assets-2');
  console.log(execSync('ls -la /tmp/gtarp-casino-assets-2/').toString());
}

// List what we already copied
console.log("\n=== COPIED ASSETS STRUCTURE ===");
try {
  console.log(execSync('find /home/user/public/assets -type f -name "*.png" | head -80').toString());
} catch(e) {
  console.log("No assets found yet");
}

console.log("\n=== ASSET COUNT ===");
try {
  console.log(execSync('find /home/user/public/assets -type f -name "*.png" | wc -l').toString());
} catch(e) {
  console.log("0");
}

// List all top-level dirs in repo
console.log("\n=== ALL REPO SUBDIRS ===");
try {
  console.log(execSync('find /tmp/gtarp-casino-assets -maxdepth 2 -type d').toString());
} catch(e) {
  console.log("Error listing dirs");
}

import { execSync } from 'child_process';
import { existsSync, readdirSync } from 'fs';

const REPO_URL = 'https://github.com/collin-labs/gtarp-casino-assets.git';
const CLONE_DIR = '/tmp/gtarp-casino-assets';

// First let's figure out the project directory from the script context
console.log('CWD:', process.cwd());
console.log('HOME:', process.env.HOME);

// Try to find the project dir
const possiblePaths = [
  process.cwd(),
  '/home/user/v0-project',
  '/home/user',
];

let projectDir = null;
for (const p of possiblePaths) {
  try {
    if (existsSync(`${p}/package.json`)) {
      projectDir = p;
      break;
    }
  } catch(e) {}
}

console.log('Project dir found:', projectDir);

// Clone the repo
if (existsSync(CLONE_DIR)) {
  execSync(`rm -rf ${CLONE_DIR}`);
}

console.log('Cloning repository...');
execSync(`git clone --depth 1 ${REPO_URL} ${CLONE_DIR}`, { stdio: 'inherit' });

// List the cloned repo structure
console.log('\nRepo root contents:');
const rootContents = readdirSync(CLONE_DIR);
console.log(rootContents);

// Check subdirectories
for (const item of rootContents) {
  try {
    const sub = readdirSync(`${CLONE_DIR}/${item}`);
    console.log(`\n${item}/:`, sub.slice(0, 5), sub.length > 5 ? `... (${sub.length} total)` : '');
  } catch(e) {}
}

// Now copy to public/assets in the project
if (projectDir) {
  const publicAssets = `${projectDir}/public/assets`;
  execSync(`mkdir -p "${publicAssets}"`, { stdio: 'inherit' });
  
  const assetDirs = ['ui', 'cards', 'logos-br-para-hero', 'logos-in-para-hero', 'image-background-transparent'];
  
  for (const dir of assetDirs) {
    const src = `${CLONE_DIR}/${dir}`;
    if (existsSync(src)) {
      console.log(`Copying ${dir}...`);
      execSync(`cp -r "${src}" "${publicAssets}/"`, { stdio: 'inherit' });
      console.log(`  -> Done`);
    } else {
      console.log(`  -> WARNING: ${src} not found`);
    }
  }
  
  // Verify
  const result = execSync(`find "${publicAssets}" -type f -name "*.png" | wc -l`).toString().trim();
  console.log(`\nTotal PNG files copied: ${result}`);
} else {
  console.log('Could not find project directory! Listing /tmp/gtarp-casino-assets for manual reference');
  const allPngs = execSync(`find ${CLONE_DIR} -type f -name "*.png" | head -20`).toString();
  console.log(allPngs);
}

console.log('\nDone!');

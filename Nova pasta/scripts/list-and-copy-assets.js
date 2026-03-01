import { execSync } from 'child_process';

const CLONE_DIR = '/tmp/gtarp-casino-assets';
const HOME_ASSETS = '/home/user/public/assets';

// Copy remaining directories we missed
const extraDirs = ['brand', 'image-para-hero', 'model-react'];
for (const dir of extraDirs) {
  console.log(`Copying ${dir}...`);
  execSync(`cp -r "${CLONE_DIR}/${dir}" "${HOME_ASSETS}/"`, { stdio: 'inherit' });
}

// List ALL png files with full paths
console.log('\n=== COMPLETE ASSET LISTING ===\n');
const allFiles = execSync(`find "${HOME_ASSETS}" -type f -name "*.png" | sort`).toString();
console.log(allFiles);

console.log('\nTotal files:');
const count = execSync(`find "${HOME_ASSETS}" -type f -name "*.png" | wc -l`).toString().trim();
console.log(count);

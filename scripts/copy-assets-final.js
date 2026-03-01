import { execSync } from 'child_process';

const REPO = '/tmp/gtarp-casino-assets-final';

// 1. Clone fresh
try { execSync(`rm -rf ${REPO}`); } catch(e) {}
console.log("Cloning repo...");
execSync(`git clone --depth 1 https://github.com/collin-labs/gtarp-casino-assets.git ${REPO}`, { stdio: 'inherit' });

// 2. Find project root by locating package.json
console.log("\n=== FINDING PROJECT ROOT ===");
let projectRoot = '';
try {
  const found = execSync('find / -maxdepth 5 -name "package.json" -path "*/v0-project/*" 2>/dev/null | head -1').toString().trim();
  if (found) {
    projectRoot = found.replace('/package.json', '');
  }
} catch(e) {}

if (!projectRoot) {
  // Try common paths
  const paths = ['/vercel/share/v0-project', '/home/user/project', process.cwd()];
  for (const p of paths) {
    try {
      execSync(`test -d ${p}`);
      projectRoot = p;
      break;
    } catch(e) {}
  }
}

console.log("Project root:", projectRoot);

if (!projectRoot) {
  // Fallback: use cwd and go up
  projectRoot = process.cwd();
  console.log("Fallback to cwd:", projectRoot);
}

const DEST = `${projectRoot}/public/assets`;

// 3. Create all directories
console.log("\n=== CREATING DIRECTORIES ===");
const dirs = ['ui', 'cards', 'logos-br-para-hero', 'logos-in-para-hero', 'image-background-transparent', 'image-para-hero', 'brand', 'model-react'];
for (const d of dirs) {
  execSync(`mkdir -p ${DEST}/${d}`);
}

// 4. Copy all assets recursively
console.log("\n=== COPYING ASSETS ===");
for (const d of dirs) {
  try {
    execSync(`cp -r ${REPO}/${d}/* ${DEST}/${d}/`, { stdio: 'inherit' });
    console.log(`Copied: ${d}`);
  } catch(e) {
    console.log(`Skip (empty or not found): ${d}`);
  }
}

// 5. Verify
console.log("\n=== VERIFICATION ===");
const count = execSync(`find ${DEST} -type f -name "*.png" | wc -l`).toString().trim();
console.log(`Total PNG files: ${count}`);

// List specific files we need
console.log("\n=== KEY FILES CHECK ===");
const keyFiles = [
  'ui/FUNDO-PARA-PAINEL-FLUTUANTE',
  'ui/IDEIA-DE-MENU',
  'ui/GTARP CASINO LETREIRO PARA TOPO',
  'ui/BUTTON-JOGAR-AGORA-ATIVO-DESATIVO',
  'cards/IMAGENS-DOURADAS-PARA-CARD',
  'logos-br-para-hero/GTARP CASINO LOGOS (BR)',
  'logos-in-para-hero/GTARP CASINO LOGOS (IN)',
  'image-background-transparent/GTARP CASINO IMAGEM DOURADA',
];

for (const kf of keyFiles) {
  try {
    const files = execSync(`find "${DEST}/${kf}" -type f -name "*.png" 2>/dev/null | head -5`).toString().trim();
    console.log(`\n[${kf}]:`);
    console.log(files || '  (empty)');
  } catch(e) {
    console.log(`\n[${kf}]: NOT FOUND`);
  }
}

console.log("\n=== DEST PATH ===");
console.log(DEST);

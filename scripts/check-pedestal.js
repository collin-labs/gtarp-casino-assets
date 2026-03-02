import { execSync } from 'child_process';
import { readdirSync, existsSync, statSync } from 'fs';
import { join } from 'path';

const root = '/vercel/share/v0-project/public/assets';

function listDir(dir, depth = 0) {
  if (!existsSync(dir)) {
    console.log(`  ${'  '.repeat(depth)}[NOT FOUND] ${dir}`);
    return;
  }
  const entries = readdirSync(dir);
  for (const e of entries) {
    const full = join(dir, e);
    const isDir = statSync(full).isDirectory();
    console.log(`  ${'  '.repeat(depth)}${isDir ? '[DIR]' : '[FILE]'} ${e}`);
    if (isDir && depth < 2) listDir(full, depth + 1);
  }
}

console.log('=== ROOT assets dir ===');
if (!existsSync(root)) {
  console.log('ROOT NOT FOUND:', root);
} else {
  const topDirs = readdirSync(root);
  console.log('Top-level dirs:', topDirs);
}

console.log('\n=== image-para-hero ===');
listDir(join(root, 'image-para-hero'));

console.log('\n=== image-background-transparent ===');
listDir(join(root, 'image-background-transparent'));

console.log('\n=== ui/BUTTON-JOGAR-AGORA-ATIVO-DESATIVO ===');
listDir(join(root, 'ui', 'BUTTON-JOGAR-AGORA-ATIVO-DESATIVO'));

// Test what pedestalPath would generate for id=1
const id = 1;
const name = 'CRASH';
const generated = `/assets/image-para-hero/GTARP CASINO IMAGEM COM PEDESTAL/${id}.${name}-IMAGEM-COM-PEDESTAL.png`;
const encoded = encodeURI(generated);
const diskPath = join(root, 'image-para-hero');
console.log('\n=== Path comparison ===');
console.log('Generated URL:', generated);
console.log('Encoded URL:', encoded);
console.log('Disk path to check:', join('/vercel/share/v0-project/public', generated));
console.log('File exists?', existsSync(join('/vercel/share/v0-project/public', generated)));

// Also check with "GTARP CASINO" directory name variations
if (existsSync(diskPath)) {
  const subDirs = readdirSync(diskPath);
  console.log('\nActual subdirs in image-para-hero:', subDirs);
  for (const sub of subDirs) {
    const subPath = join(diskPath, sub);
    if (statSync(subPath).isDirectory()) {
      const files = readdirSync(subPath).slice(0, 5);
      console.log(`  Files in "${sub}":`, files);
    }
  }
}

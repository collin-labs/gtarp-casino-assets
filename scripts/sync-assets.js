import { execSync } from 'child_process';

const src = '/home/user/public/assets';
const dest = '/vercel/share/v0-project/public/assets';

try {
  // Create dest
  execSync(`mkdir -p "${dest}"`);
  
  // Copy everything preserving structure
  execSync(`cp -r "${src}/." "${dest}/"`);
  
  // Verify
  const count = execSync(`find "${dest}" -name "*.png" | wc -l`).toString().trim();
  console.log(`Synced ${count} PNG files to ${dest}`);
  
  // List top-level dirs
  const dirs = execSync(`ls -la "${dest}"`).toString();
  console.log(dirs);
  
  // Check specific key files
  const keyFiles = [
    'ui/FUNDO-PARA-PAINEL-FLUTUANTE/FUNDO-PARA-PAINEL-FLUTUANTE.png',
    'ui/IDEIA-DE-MENU/MENU-DOURADO-MODELO1-SEM-TEXTO.png',
    'ui/GTARP CASINO LETREIRO PARA TOPO/GTARP CASINO LETREIRO PARA TOPO.png',
    'ui/BUTTON-JOGAR-AGORA-ATIVO-DESATIVO/BUTTON-JOGAR-AGORA-ATIVO-SEM-TEXTO.png',
    'cards/IMAGENS-DOURADAS-PARA-CARD/1.CRASH.png',
    'logos-br-para-hero/GTARP CASINO LOGOS (BR)/1.LOGO-BR-CRASH.png',
    'image-background-transparent/GTARP CASINO IMAGEM DOURADA/1.IMAGEM-DOURADA-CRASH.png',
  ];
  
  for (const f of keyFiles) {
    try {
      execSync(`test -f "${dest}/${f}"`);
      console.log(`OK: ${f}`);
    } catch {
      console.log(`MISSING: ${f}`);
    }
  }
} catch (e) {
  console.error('Error:', e.message);
}

import { execSync } from 'child_process';

const pedestalDir = '/vercel/share/v0-project/public/assets/image-para-hero';

try {
  // Check if directory exists
  const exists = execSync(`test -d "${pedestalDir}" && echo "EXISTS" || echo "NOT FOUND"`).toString().trim();
  console.log(`[v0] Pedestal directory: ${exists}`);
  
  if (exists === "EXISTS") {
    // List all files
    const files = execSync(`find "${pedestalDir}" -type f -name "*.png" | head -30`).toString().trim();
    console.log(`[v0] Pedestal files:\n${files}`);
  }
  
  // Also check the gold images directory
  const goldDir = '/vercel/share/v0-project/public/assets/image-background-transparent';
  const goldExists = execSync(`test -d "${goldDir}" && echo "EXISTS" || echo "NOT FOUND"`).toString().trim();
  console.log(`\n[v0] Gold directory: ${goldExists}`);
  
  if (goldExists === "EXISTS") {
    const goldFiles = execSync(`find "${goldDir}" -type f -name "*.png" | head -30`).toString().trim();
    console.log(`[v0] Gold files:\n${goldFiles}`);
  }

  // Check the button files
  const btnDir = '/vercel/share/v0-project/public/assets/ui/BUTTON-JOGAR-AGORA-ATIVO-DESATIVO';
  const btnExists = execSync(`test -d "${btnDir}" && echo "EXISTS" || echo "NOT FOUND"`).toString().trim();
  console.log(`\n[v0] Button directory: ${btnExists}`);
  
  if (btnExists === "EXISTS") {
    const btnFiles = execSync(`find "${btnDir}" -type f -name "*.png"`).toString().trim();
    console.log(`[v0] Button files:\n${btnFiles}`);
  }

  // Check the letreiro
  const letDir = '/vercel/share/v0-project/public/assets/ui';
  const letFiles = execSync(`find "${letDir}" -maxdepth 2 -name "*LETREIRO*" 2>/dev/null || echo "NOT FOUND"`).toString().trim();
  console.log(`\n[v0] Letreiro files:\n${letFiles}`);

} catch (e) {
  console.error('[v0] Error:', e.message);
}

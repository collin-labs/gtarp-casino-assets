# CORRECOES RAPIDAS — ERROS COMUNS DO V0 — SLOT MACHINE
# Copiar e colar quando o V0 errar

## ERRO 1: placeholder/imagens nao encontradas
Todas existem. Navegue: public/assets/games/slots/ (symbols/ classic/ overlays/), shared/icons/ (24), shared/ui/. ZERO placeholder.

## ERRO 2: Tailwind
ZERO Tailwind. style={{}} com camelCase. Corrija TODOS os className.

## ERRO 3: Fundo claro
Dark mode APENAS. #0A0A0A principal, rgba(26,26,46,0.6) secundario. NUNCA branco/cinza.

## ERRO 4: px fixo
clamp() em fontSize, padding, gap. Excecao: icones 16/24px.

## ERRO 5: Sem hover/active/disabled
whileHover={{scale:1.05}}, whileTap={{scale:0.95}}. Disabled: opacity 0.5, pointerEvents "none".

## ERRO 6: Sem bilingue
{br:"...", en:"..."} em todos os textos.

## ERRO 7: Nao leu docs da pasta student/
Navegue ate student/estudo-dos-jogos/2.SLOT-MACHINE/ e leia os arquivos pedidos.

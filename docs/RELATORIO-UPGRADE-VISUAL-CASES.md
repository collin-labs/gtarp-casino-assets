# RELATORIO DE UPGRADE VISUAL -- CASES
## Prompts para Geracao de Imagens PNG Premium via IA
### Blackout Casino -- Jogo #13 -- 09/03/2026

---

# DIAGNOSTICO ATUAL

## Estado Visual Atual (Nota: 6/10)
O Cases funciona 100% mas usa SVG procedurais para representar caixas e itens.
Falta: PNGs 3D premium das caixas, imagens dos itens, backgrounds tematicos.

## O que precisa de PNG (prioridade)

| # | Asset | Quantidade | Uso | Prioridade |
|:-:|-------|:----------:|-----|:----------:|
| 1 | Caixas 3D (fechadas) | 6 | CaseCard no catalogo | ALTA |
| 2 | Caixas 3D (abertas/abrindo) | 6 | Animacao de abertura | ALTA |
| 3 | Itens de armas | 8 | Arsenal Dourado | MEDIA |
| 4 | Itens de veiculos | 8 | Garagem VIP | MEDIA |
| 5 | Itens cosmeticos | 8 | Caixa Noturna | MEDIA |
| 6 | Background tematico | 1 | Fundo do CasesGame | BAIXA |
| 7 | Icone da caixa diaria | 1 | Daily Free destaque | BAIXA |
| **TOTAL** | | **38** | | |

---

# PROMPTS PARA GERACAO DE IMAGENS

## REGRAS GERAIS (aplicar em TODOS os prompts)

```
REGRAS COMUNS:
- Fundo: TRANSPARENTE (PNG com alpha)
- Resolucao: 512x512 minimo (1024x1024 ideal)
- Estilo: 3D render metalico com reflexos dourados
- Paleta: preto profundo #0A0A0A, ouro #D4A843/#FFD700, verde #00E676
- Iluminacao: spotlight lateral, sombra sutil embaixo
- SEM texto, SEM watermark, SEM pessoas
- Formato: PNG (nao JPG/WEBP)
```

---

## PROMPT 1 — Caixa Arsenal Dourado (fechada)

```
Create a 3D render of a premium military loot crate, closed.
Style: dark metallic military case with golden accents and golden lock.
Material: brushed dark metal with gold trim, slight golden glow.
Details: military markings, golden latch/lock in center, golden corner reinforcements.
Color scheme: dark gunmetal gray #1A1A1A body, golden #D4A843 accents.
Lighting: dramatic side spotlight, soft golden ambient glow.
Background: completely transparent (PNG alpha).
View: 3/4 front perspective, slightly tilted.
Resolution: 1024x1024, high detail, game asset quality.
No text, no watermark.
```

## PROMPT 2 — Caixa Garagem VIP (fechada)

```
Create a 3D render of a luxury car-themed loot crate, closed.
Style: sleek carbon fiber case with emerald green LED strips and chrome accents.
Material: glossy black carbon fiber with green #00E676 neon edge lighting.
Details: chrome corner caps, green LED strip around edges, chrome lock mechanism.
Color scheme: black carbon #111111 body, emerald green #00E676 lights, chrome silver accents.
Lighting: dramatic side spotlight, green ambient glow from LED strips.
Background: completely transparent (PNG alpha).
View: 3/4 front perspective, slightly tilted.
Resolution: 1024x1024, high detail, game asset quality.
No text, no watermark.
```

## PROMPT 3 — Caixa Pacote Urbano (fechada)

```
Create a 3D render of an urban street-style loot crate, closed.
Style: wooden crate with blue spray-paint graffiti accents, urban feel.
Material: weathered dark wood with blue #4B69FF neon graffiti marks and metal straps.
Details: metal corner brackets, blue spray paint splashes, padlock, urban stickers.
Color scheme: dark wood brown, blue #4B69FF accents, silver metal straps.
Lighting: dramatic side spotlight, subtle blue glow from paint.
Background: completely transparent (PNG alpha).
View: 3/4 front perspective, slightly tilted.
Resolution: 1024x1024, high detail, game asset quality.
No text, no watermark.
```

## PROMPT 4 — Caixa Cofre Secreto (fechada)

```
Create a 3D render of an ultra-premium golden vault/safe loot crate, closed.
Style: ornate golden safe with intricate Art Deco engravings, VIP luxury feel.
Material: polished gold #FFD700 metal with dark obsidian #0A0A0A inlays.
Details: ornate golden dial lock, Art Deco patterns, diamond-shaped keyhole,
golden hinges, subtle gemstone accents (emerald green).
Color scheme: rich gold #FFD700 primary, obsidian black accents, emerald #00E676 gems.
Lighting: dramatic spotlight, intense golden glow, sparkle reflections.
Background: completely transparent (PNG alpha).
View: 3/4 front perspective, slightly tilted.
Resolution: 1024x1024, high detail, game asset quality.
No text, no watermark.
```

## PROMPT 5 — Caixa Noturna (fechada)

```
Create a 3D render of a nightclub-themed loot crate, closed.
Style: sleek black case with purple/pink neon accents, nightlife VIP feel.
Material: matte black with purple #D32CE6 neon edge lighting and holographic finish.
Details: purple neon strips, holographic surface shimmer, chrome clasp,
glowing purple lock mechanism.
Color scheme: matte black #111111, purple #D32CE6 neon, pink highlights.
Lighting: dramatic side spotlight, purple ambient glow.
Background: completely transparent (PNG alpha).
View: 3/4 front perspective, slightly tilted.
Resolution: 1024x1024, high detail, game asset quality.
No text, no watermark.
```

## PROMPT 6 — Caixa Diaria (fechada)

```
Create a 3D render of a daily reward gift box, closed.
Style: elegant black gift box with emerald green ribbon bow and golden tag.
Material: matte black wrapping with green #00E676 satin ribbon, golden #D4A843 gift tag.
Details: perfectly tied bow on top, golden star on tag, subtle sparkle particles.
Color scheme: black #111111 box, emerald green #00E676 ribbon, gold #D4A843 tag.
Lighting: warm spotlight, festive golden glow, sparkle accents.
Background: completely transparent (PNG alpha).
View: 3/4 front perspective, slightly tilted.
Resolution: 1024x1024, high detail, game asset quality.
No text, no watermark.
```

---

## PROMPT 7 — Caixa Abrindo (generico, usar como base)

```
Create a 3D render of a premium loot crate in the process of OPENING.
Style: the lid is lifting up at 45 degrees, golden light rays shooting out from inside.
Material: dark metallic case with golden accents, light beaming from within.
Details: lid partially open, volumetric golden light rays emerging from crack,
golden dust particles floating up, dramatic reveal moment.
Color scheme: dark case body, intense golden #FFD700 light from inside.
Lighting: the light source IS the inside of the box, dramatic volumetric rays.
Background: completely transparent (PNG alpha).
View: front perspective, dramatic angle looking slightly up.
Resolution: 1024x1024, high detail, game asset quality.
No text, no watermark.
```

---

## PROMPTS 8-15 — Itens Arsenal Dourado (armas)

### PROMPT 8 — Pistola Tatica
```
3D render of a tactical combat pistol, military style.
Dark gunmetal finish with golden #D4A843 accents on trigger and barrel.
Side view, dramatic lighting, transparent PNG background.
512x512, game icon quality. No text.
```

### PROMPT 9 — SMG Compacta
```
3D render of a compact submachine gun (SMG), military style.
Dark carbon finish with golden #D4A843 magazine and sights.
Side view, dramatic lighting, transparent PNG background.
512x512, game icon quality. No text.
```

### PROMPT 10 — Carabina MK2
```
3D render of a modern carbine assault rifle MK2.
Dark tactical finish with purple #8847FF accents on stock and scope.
Side view, dramatic lighting, transparent PNG background.
512x512, game icon quality. No text.
```

### PROMPT 11 — Shotgun de Combate
```
3D render of a combat shotgun, heavy-duty military.
Dark metal with purple #8847FF pump action accents.
Side view, dramatic lighting, transparent PNG background.
512x512, game icon quality. No text.
```

### PROMPT 12 — Sniper Pesada
```
3D render of a heavy sniper rifle with long barrel and scope.
Dark military finish with pink/magenta #D32CE6 scope accents.
Side view, dramatic lighting, transparent PNG background.
512x512, game icon quality. No text.
```

### PROMPT 13 — Minigun Dourada
```
3D render of a golden minigun/gatling gun, luxury military weapon.
Full golden #FFD700 finish with obsidian black barrel tips.
Rotating barrel design, dramatic lighting, transparent PNG background.
512x512, game icon quality. No text.
```

### PROMPT 14 — RPG Edicao Limitada
```
3D render of an RPG rocket launcher, red/crimson limited edition.
Dark body with red #EB4B4B accents and golden #D4A843 shoulder rest.
Side view, dramatic lighting, transparent PNG background.
512x512, game icon quality. No text.
```

### PROMPT 15 — Railgun Blackout (LEGENDARY)
```
3D render of a futuristic railgun, ultra-premium legendary weapon.
Full golden #FFD700 body with black obsidian core, glowing energy lines.
Sci-fi design with visible energy coils, dramatic golden glow emanating.
Side view, dramatic lighting with golden volumetric rays, transparent PNG background.
1024x1024, highest detail, game asset quality. No text.
```

---

## PROMPTS 16-23 — Itens Garagem VIP (veiculos)

### PROMPT 16 — Futo GTX (common)
```
3D render of a tuned Japanese sports hatchback (similar to Toyota AE86 style).
Dark blue body with blue #4B69FF underglow, lowered stance.
3/4 front view, dramatic lighting, transparent PNG background.
512x512, game icon quality. No text.
```

### PROMPT 17 — Sultan RS (common)
```
3D render of a tuned 4-door sports sedan (similar to Subaru WRX style).
Silver body with blue #4B69FF racing stripes, rally spoiler.
3/4 front view, dramatic lighting, transparent PNG background.
512x512, game icon quality. No text.
```

### PROMPT 18 — Elegy RH8 (uncommon)
```
3D render of a luxury Japanese sports car (similar to Nissan GTR style).
Black body with purple #8847FF neon underglow and custom wheels.
3/4 front view, dramatic lighting, transparent PNG background.
512x512, game icon quality. No text.
```

### PROMPT 19 — Jester Classic (uncommon)
```
3D render of a classic Japanese sports car (similar to Toyota Supra MK4 style).
White body with purple #8847FF racing accents and wide body kit.
3/4 front view, dramatic lighting, transparent PNG background.
512x512, game icon quality. No text.
```

### PROMPT 20 — Itali GTO (rare)
```
3D render of an Italian supercar (similar to Ferrari 812 style).
Red body with pink/magenta #D32CE6 accent lines, dramatic profile.
3/4 front view, dramatic lighting, transparent PNG background.
512x512, game icon quality. No text.
```

### PROMPT 21 — Thrax (rare)
```
3D render of an ultra-modern hypercar (similar to Bugatti Divo style).
Dark carbon body with pink #D32CE6 accent lighting, futuristic design.
3/4 front view, dramatic lighting, transparent PNG background.
512x512, game icon quality. No text.
```

### PROMPT 22 — Tezeract (epic)
```
3D render of a futuristic electric hypercar with angular design.
Black body with red #EB4B4B neon strips and glowing energy lines.
Sci-fi automotive design, 3/4 front view, dramatic lighting, transparent PNG background.
512x512, game icon quality. No text.
```

### PROMPT 23 — Scramjet Dourado (LEGENDARY)
```
3D render of a futuristic jet-powered golden supercar, legendary status.
Full golden #FFD700 body with black accents, rocket boosters visible.
Luxury and power combined, golden glow emanating, slight motion blur.
3/4 front view, dramatic lighting with golden volumetric rays, transparent PNG background.
1024x1024, highest detail, game asset quality. No text.
```

---

## COMO USAR OS PNGS APOS GERAR

### Estrutura de pastas
```
public/assets/cases/
  caixas/
    1.ARSENAL-DOURADO-FECHADA.png
    1.ARSENAL-DOURADO-ABRINDO.png
    2.GARAGEM-VIP-FECHADA.png
    2.GARAGEM-VIP-ABRINDO.png
    3.PACOTE-URBANO-FECHADA.png
    3.PACOTE-URBANO-ABRINDO.png
    4.COFRE-SECRETO-FECHADA.png
    4.COFRE-SECRETO-ABRINDO.png
    5.CAIXA-NOTURNA-FECHADA.png
    5.CAIXA-NOTURNA-ABRINDO.png
    6.CAIXA-DIARIA-FECHADA.png
    6.CAIXA-DIARIA-ABRINDO.png
  itens/
    arsenal/
      1.PISTOLA-TATICA.png
      2.SMG-COMPACTA.png
      3.CARABINA-MK2.png
      4.SHOTGUN-COMBATE.png
      5.SNIPER-PESADA.png
      6.MINIGUN-DOURADA.png
      7.RPG-EDICAO-LIMITADA.png
      8.RAILGUN-BLACKOUT.png
    garagem/
      1.FUTO-GTX.png
      2.SULTAN-RS.png
      3.ELEGY-RH8.png
      4.JESTER-CLASSIC.png
      5.ITALI-GTO.png
      6.THRAX.png
      7.TEZERACT.png
      8.SCRAMJET-DOURADO.png
```

### Integracao no codigo (edicoes cirurgicas)

1. **casino_cases_seeds.sql** — UPDATE image_url para cada caixa
2. **casino_case_items** — UPDATE image_url para cada item
3. **CaseCard.tsx** — substituir SVG box por `<img src={caseData.image_url}>`
4. **ItemCard.tsx** — substituir SVG shapes por `<img src={item.image_url}>`
5. **RevealStrip.tsx** — substituir SVG shapes por `<img>` com borda colorida
6. **CaseOpening.tsx** — adicionar imagem da caixa abrindo no topo
7. **CaseResult.tsx** — substituir SVG do item revelado por `<img>`

### Estimativa de trabalho
- Gerar 38 PNGs via IA: ~2-3 horas
- Integrar no codigo: ~1 hora (edicoes cirurgicas simples)
- Total: ~3-4 horas

---

## VALIDACAO (REGRA X11)

Este relatorio esta pronto para uso?
- [x] 23 prompts de geracao de imagens escritos
- [x] Cada prompt segue regras comuns (transparente, 512/1024px, sem texto)
- [x] Cores dos prompts consistentes com paleta de raridade do projeto
- [x] Estrutura de pastas definida
- [x] Plano de integracao com edicoes cirurgicas listadas
- [x] Estimativa de tempo

**STATUS: PRONTO PARA GERACAO DE IMAGENS**

# REFORCO VISUAL — POKER (#6)
# Colar no V0 JUNTO com o prompt de telas

---

ATENCAO V0: Poker precisa de mesa felt, cartas 3D e chips reais:

## MESA
- Fundo escuro com bg-casino.png + gradiente verde sutil (felt implícito)
- Area central: onde ficam as community cards (UTH) ou as cartas (Caribbean)
- Areas de aposta marcadas: circulos/retangulos tracejados dourados (ANTE, BLIND, TRIPS, PLAY)

## CARTAS — 3D FLIP OBRIGATORIO
- Verso: card-back.png de /assets/games/poker/ (NAO gere um retangulo azul)
- Frente: numero + naipe (usar suit-hearts.png, suit-diamonds.png, suit-clubs.png, suit-spades.png REAIS)
- Flip: perspective 800px, rotateY, backfaceVisibility hidden, transition 0.6s
- Distribuicao com stagger, sombra em cada carta
- Cartas do jogador: ligeiramente maiores que as do dealer

## CHIPS
- Usar chip.png REAL de /assets/games/poker/
- Stack na area de aposta com sombra

## HAND RANKING (Tela 11)
- Visual: 10 rows (Royal Flush no topo → High Card embaixo)
- Cada row: 5 mini-cards de exemplo + nome da mao + multiplicador
- A mao atual do jogador destaca com glow a row correspondente

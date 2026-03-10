// =====================================================
// BLACKOUT CASINO -- CASES -- Server Handlers
// 12 handlers NUI: 8 base + 4 battles
// Provably Fair com SHA-256
// =====================================================

const crypto = require('crypto');

// Config
const SERVER_SEED = crypto.randomBytes(32).toString('hex');
const COOLDOWN_MS = 3000;
const lastOpen = new Map();

module.exports = function(conn, vRP) {

  // === HANDLER 1: Catalogo ===
  RegisterNuiCallback('casino:cases:catalog', async (data, cb) => {
    try {
      const [cases] = await conn.execute(
        `SELECT c.*, COUNT(i.id) as item_count
         FROM casino_cases c
         LEFT JOIN casino_case_items i ON i.case_id = c.id AND i.is_active = 1
         WHERE c.is_active = 1
         GROUP BY c.id
         ORDER BY c.sort_order`
      );
      for (const cs of cases) {
        const [preview] = await conn.execute(
          `SELECT name, rarity, rarity_color, value FROM casino_case_items
           WHERE case_id = ? AND is_active = 1
           ORDER BY FIELD(rarity,'legendary','epic','rare','uncommon','common'), value DESC
           LIMIT 3`,
          [cs.id]
        );
        cs.preview = preview;
      }
      cb({ ok: true, cases });
    } catch (err) {
      console.error('[CASES] catalog error:', err);
      cb({ ok: false, error: 'Erro ao carregar catalogo' });
    }
  });

  // === HANDLER 2: Preview da caixa ===
  RegisterNuiCallback('casino:cases:preview', async (data, cb) => {
    try {
      const { caseId } = data;
      const [[caseData]] = await conn.execute(
        'SELECT * FROM casino_cases WHERE id = ? AND is_active = 1', [caseId]
      );
      if (!caseData) return cb({ ok: false, error: 'Caixa nao encontrada' });

      const [items] = await conn.execute(
        `SELECT id, name, description, image_url, rarity, rarity_color, value,
                sell_back_value, probability, item_type
         FROM casino_case_items WHERE case_id = ? AND is_active = 1
         ORDER BY FIELD(rarity,'legendary','epic','rare','uncommon','common'), probability ASC`,
        [caseId]
      );
      cb({ ok: true, case: caseData, items });
    } catch (err) {
      console.error('[CASES] preview error:', err);
      cb({ ok: false, error: 'Erro ao carregar preview' });
    }
  });

  // === HANDLER 3: Abrir caixa (PRINCIPAL) ===
  RegisterNuiCallback('casino:cases:open', async (data, cb) => {
    const userId = source;
    const { caseId } = data;

    try {
      // Rate limit
      const lastTime = lastOpen.get(userId) || 0;
      if (Date.now() - lastTime < COOLDOWN_MS) {
        return cb({ ok: false, error: 'Aguarde 3 segundos entre aberturas' });
      }

      // Caixa existe
      const [[caseData]] = await conn.execute(
        'SELECT * FROM casino_cases WHERE id = ? AND is_active = 1', [caseId]
      );
      if (!caseData) return cb({ ok: false, error: 'Caixa nao encontrada' });

      // Saldo
      const balance = vRP.getMoney(userId);
      if (balance < caseData.price) {
        return cb({ ok: false, error: 'Saldo insuficiente' });
      }

      // Itens existem
      const [items] = await conn.execute(
        `SELECT * FROM casino_case_items WHERE case_id = ? AND is_active = 1`, [caseId]
      );
      if (items.length === 0) return cb({ ok: false, error: 'Caixa sem itens' });

      // Provably Fair
      const nonce = Date.now();
      const combined = `${SERVER_SEED}:${userId}:${caseId}:${nonce}`;
      const hash = crypto.createHash('sha256').update(combined).digest('hex');
      const decimal = parseInt(hash.substring(0, 8), 16) / 0xFFFFFFFF;

      // Weighted random
      let cumulative = 0;
      let selectedItem = items[0];
      const roll = decimal * 100;
      for (const item of items) {
        cumulative += parseFloat(item.probability);
        if (roll <= cumulative) {
          selectedItem = item;
          break;
        }
      }

      // Transaction
      await conn.beginTransaction();
      try {
        vRP.removeMoney(userId, caseData.price);

        const [openResult] = await conn.execute(
          `INSERT INTO casino_cases_openings
           (user_id, case_id, item_id, price_paid, item_value, hash, seed_nonce, is_free, action)
           VALUES (?, ?, ?, ?, ?, ?, ?, 0, 'pending')`,
          [userId, caseId, selectedItem.id, caseData.price, selectedItem.value, hash, nonce]
        );
        const openingId = openResult.insertId;

        await conn.execute(
          `INSERT INTO casino_cases_inventory (user_id, opening_id, item_id) VALUES (?, ?, ?)`,
          [userId, openingId, selectedItem.id]
        );

        await conn.execute(
          `INSERT INTO casino_cases_audit (user_id, action, details) VALUES (?, 'open', ?)`,
          [userId, JSON.stringify({
            case_id: caseId, case_name: caseData.name,
            item_id: selectedItem.id, item_name: selectedItem.name,
            rarity: selectedItem.rarity, price: caseData.price,
            value: selectedItem.value, hash, nonce
          })]
        );

        await conn.commit();
        lastOpen.set(userId, Date.now());

        // Broadcast para feed
        emitNet('casino:cases:drop', -1, {
          username: vRP.getUserName(userId),
          item: selectedItem.name,
          rarity: selectedItem.rarity,
          rarity_color: selectedItem.rarity_color,
          value: selectedItem.value,
        });

        cb({
          ok: true,
          item: {
            id: selectedItem.id, name: selectedItem.name,
            rarity: selectedItem.rarity, rarity_color: selectedItem.rarity_color,
            value: selectedItem.value, sell_back_value: selectedItem.sell_back_value,
            image_url: selectedItem.image_url, item_type: selectedItem.item_type,
          },
          opening_id: openingId,
          hash, seed_nonce: nonce,
          newBalance: vRP.getMoney(userId),
        });

      } catch (txErr) {
        await conn.rollback();
        throw txErr;
      }

    } catch (err) {
      console.error('[CASES] open error:', err);
      cb({ ok: false, error: 'Erro ao abrir caixa' });
    }
  });

  // === HANDLER 4: Vender item ===
  RegisterNuiCallback('casino:cases:sell', async (data, cb) => {
    const userId = source;
    const { openingId } = data;
    try {
      const [[opening]] = await conn.execute(
        `SELECT o.*, i.sell_back_value, i.name as item_name
         FROM casino_cases_openings o
         JOIN casino_case_items i ON o.item_id = i.id
         WHERE o.id = ? AND o.user_id = ? AND o.action = 'pending'`,
        [openingId, userId]
      );
      if (!opening) return cb({ ok: false, error: 'Item nao encontrado ou ja vendido' });
      if (opening.sell_back_value <= 0) return cb({ ok: false, error: 'Item nao pode ser vendido' });

      await conn.beginTransaction();
      try {
        await conn.execute(`UPDATE casino_cases_openings SET action='sold', sold_at=NOW() WHERE id=?`, [openingId]);
        await conn.execute(`UPDATE casino_cases_inventory SET status='sold', sold_at=NOW() WHERE opening_id=?`, [openingId]);
        vRP.addMoney(userId, opening.sell_back_value);
        await conn.execute(
          `INSERT INTO casino_cases_audit (user_id, action, details) VALUES (?, 'sell', ?)`,
          [userId, JSON.stringify({ opening_id: openingId, item: opening.item_name, sold_for: opening.sell_back_value })]
        );
        await conn.commit();
        cb({ ok: true, soldFor: opening.sell_back_value, newBalance: vRP.getMoney(userId) });
      } catch (txErr) {
        await conn.rollback();
        throw txErr;
      }
    } catch (err) {
      console.error('[CASES] sell error:', err);
      cb({ ok: false, error: 'Erro ao vender item' });
    }
  });

  // === HANDLER 5: Guardar item ===
  RegisterNuiCallback('casino:cases:keep', async (data, cb) => {
    const userId = source;
    const { openingId } = data;
    try {
      const [[opening]] = await conn.execute(
        `SELECT o.*, i.item_type, i.game_item_id, i.name as item_name, i.value
         FROM casino_cases_openings o
         JOIN casino_case_items i ON o.item_id = i.id
         WHERE o.id = ? AND o.user_id = ? AND o.action = 'pending'`,
        [openingId, userId]
      );
      if (!opening) return cb({ ok: false, error: 'Item nao encontrado' });

      await conn.execute(`UPDATE casino_cases_openings SET action='kept' WHERE id=?`, [openingId]);

      // Entregar item conforme tipo
      let delivered = false;
      if (opening.item_type === 'weapon' && opening.game_item_id) {
        vRP.giveWeapon(userId, opening.game_item_id, 100);
        delivered = true;
      } else if (opening.item_type === 'money') {
        vRP.addMoney(userId, opening.value);
        delivered = true;
      } else if (opening.item_type === 'vehicle' && opening.game_item_id) {
        await conn.execute(
          `INSERT INTO player_vehicles (user_id, vehicle, stored) VALUES (?, ?, 1)`,
          [userId, opening.game_item_id]
        );
        delivered = true;
      }
      // cosmetic/clothing/vip ficam no inventario do casino

      await conn.execute(
        `INSERT INTO casino_cases_audit (user_id, action, details) VALUES (?, 'keep', ?)`,
        [userId, JSON.stringify({ opening_id: openingId, item: opening.item_name, type: opening.item_type, delivered })]
      );
      cb({ ok: true, delivered });
    } catch (err) {
      console.error('[CASES] keep error:', err);
      cb({ ok: false, error: 'Erro ao guardar item' });
    }
  });

  // === HANDLER 6: Historico (ultimos drops de todos) ===
  RegisterNuiCallback('casino:cases:history', async (data, cb) => {
    try {
      const limit = Math.min(data.limit || 20, 50);
      const [drops] = await conn.execute(
        `SELECT o.created_at, o.item_value as value,
                i.name as item_name, i.rarity, i.rarity_color
         FROM casino_cases_openings o
         JOIN casino_case_items i ON o.item_id = i.id
         ORDER BY o.created_at DESC LIMIT ?`,
        [limit]
      );
      cb({ ok: true, drops });
    } catch (err) {
      cb({ ok: false, error: 'Erro ao carregar historico' });
    }
  });

  // === HANDLER 7: Meu inventario ===
  RegisterNuiCallback('casino:cases:my_inventory', async (data, cb) => {
    const userId = source;
    try {
      const [items] = await conn.execute(
        `SELECT inv.id, inv.opening_id, inv.acquired_at,
                i.name, i.rarity, i.rarity_color, i.value, i.sell_back_value, i.image_url
         FROM casino_cases_inventory inv
         JOIN casino_case_items i ON inv.item_id = i.id
         WHERE inv.user_id = ? AND inv.status = 'owned'
         ORDER BY inv.acquired_at DESC`,
        [userId]
      );
      cb({ ok: true, items });
    } catch (err) {
      cb({ ok: false, error: 'Erro ao carregar inventario' });
    }
  });

  // === HANDLER 8: Daily Free Case ===
  RegisterNuiCallback('casino:cases:daily_free', async (data, cb) => {
    const userId = source;
    try {
      const [[{ count }]] = await conn.execute(
        `SELECT COUNT(*) as count FROM casino_cases_openings
         WHERE user_id = ? AND is_free = 1 AND created_at > NOW() - INTERVAL 24 HOUR`,
        [userId]
      );
      if (count > 0) {
        return cb({ ok: false, error: 'Ja abriu a caixa gratis hoje. Volte amanha!' });
      }

      const [[freeCase]] = await conn.execute(
        `SELECT * FROM casino_cases WHERE category = 'daily_free' AND is_active = 1 LIMIT 1`
      );
      if (!freeCase) return cb({ ok: false, error: 'Caixa diaria nao disponivel' });

      const [items] = await conn.execute(
        `SELECT * FROM casino_case_items WHERE case_id = ? AND is_active = 1`, [freeCase.id]
      );

      // Provably Fair
      const nonce = Date.now();
      const hash = crypto.createHash('sha256')
        .update(`${SERVER_SEED}:${userId}:${freeCase.id}:${nonce}`).digest('hex');
      const roll = (parseInt(hash.substring(0, 8), 16) / 0xFFFFFFFF) * 100;

      let cumulative = 0, selectedItem = items[0];
      for (const item of items) {
        cumulative += parseFloat(item.probability);
        if (roll <= cumulative) { selectedItem = item; break; }
      }

      const [openResult] = await conn.execute(
        `INSERT INTO casino_cases_openings
         (user_id, case_id, item_id, price_paid, item_value, hash, seed_nonce, is_free, action)
         VALUES (?, ?, ?, 0, ?, ?, ?, 1, 'pending')`,
        [userId, freeCase.id, selectedItem.id, selectedItem.value, hash, nonce]
      );

      await conn.execute(
        `INSERT INTO casino_cases_inventory (user_id, opening_id, item_id) VALUES (?, ?, ?)`,
        [userId, openResult.insertId, selectedItem.id]
      );

      await conn.execute(
        `INSERT INTO casino_cases_audit (user_id, action, details) VALUES (?, 'daily_claim', ?)`,
        [userId, JSON.stringify({ item: selectedItem.name, rarity: selectedItem.rarity })]
      );

      cb({
        ok: true, isFree: true,
        item: {
          id: selectedItem.id, name: selectedItem.name,
          rarity: selectedItem.rarity, rarity_color: selectedItem.rarity_color,
          value: selectedItem.value, sell_back_value: selectedItem.sell_back_value,
          image_url: selectedItem.image_url,
        },
        opening_id: openResult.insertId, hash, seed_nonce: nonce,
      });
    } catch (err) {
      console.error('[CASES] daily_free error:', err);
      cb({ ok: false, error: 'Erro ao abrir caixa gratis' });
    }
  });

  // =====================================================
  // CASE BATTLES PvP (4 handlers)
  // =====================================================

  // === HANDLER 9: Criar batalha ===
  RegisterNuiCallback('casino:cases:battle_create', async (data, cb) => {
    const userId = source;
    const { maxPlayers, caseSequence } = data;

    try {
      if (!caseSequence || !Array.isArray(caseSequence) || caseSequence.length === 0 || caseSequence.length > 5) {
        return cb({ ok: false, error: 'Selecione 1-5 caixas para a batalha' });
      }
      if (![2, 4].includes(maxPlayers)) {
        return cb({ ok: false, error: 'Batalha deve ter 2 ou 4 jogadores' });
      }

      // Calcular entry fee (soma dos precos das caixas)
      let entryFee = 0;
      for (const caseId of caseSequence) {
        const [[cs]] = await conn.execute(
          'SELECT price FROM casino_cases WHERE id = ? AND is_active = 1', [caseId]
        );
        if (!cs) return cb({ ok: false, error: `Caixa ${caseId} nao encontrada` });
        entryFee += parseFloat(cs.price);
      }

      // Verificar saldo do criador
      const balance = vRP.getMoney(userId);
      if (balance < entryFee) {
        return cb({ ok: false, error: 'Saldo insuficiente para criar batalha' });
      }

      // Cobrar entry fee do criador
      vRP.removeMoney(userId, entryFee);

      // Criar batalha
      const [result] = await conn.execute(
        `INSERT INTO casino_cases_battles (creator_id, max_players, case_sequence, entry_fee, total_pot)
         VALUES (?, ?, ?, ?, ?)`,
        [userId, maxPlayers, JSON.stringify(caseSequence), entryFee, entryFee]
      );
      const battleId = result.insertId;

      // Adicionar criador como primeiro jogador
      await conn.execute(
        `INSERT INTO casino_cases_battle_players (battle_id, user_id) VALUES (?, ?)`,
        [battleId, userId]
      );

      await conn.execute(
        `INSERT INTO casino_cases_audit (user_id, action, details) VALUES (?, 'battle_create', ?)`,
        [userId, JSON.stringify({ battle_id: battleId, entry_fee: entryFee, max_players: maxPlayers, cases: caseSequence })]
      );

      cb({ ok: true, battleId, entryFee, newBalance: vRP.getMoney(userId) });
    } catch (err) {
      console.error('[CASES] battle_create error:', err);
      cb({ ok: false, error: 'Erro ao criar batalha' });
    }
  });

  // === HANDLER 10: Entrar em batalha ===
  RegisterNuiCallback('casino:cases:battle_join', async (data, cb) => {
    const userId = source;
    const { battleId } = data;

    try {
      const [[battle]] = await conn.execute(
        'SELECT * FROM casino_cases_battles WHERE id = ? AND status = ?', [battleId, 'waiting']
      );
      if (!battle) return cb({ ok: false, error: 'Batalha nao encontrada ou ja iniciou' });

      // Verificar se ja esta na batalha
      const [[existing]] = await conn.execute(
        'SELECT id FROM casino_cases_battle_players WHERE battle_id = ? AND user_id = ?',
        [battleId, userId]
      );
      if (existing) return cb({ ok: false, error: 'Voce ja esta nesta batalha' });

      // Contar jogadores atuais
      const [[{ playerCount }]] = await conn.execute(
        'SELECT COUNT(*) as playerCount FROM casino_cases_battle_players WHERE battle_id = ?',
        [battleId]
      );
      if (playerCount >= battle.max_players) return cb({ ok: false, error: 'Batalha lotada' });

      // Verificar saldo
      const balance = vRP.getMoney(userId);
      if (balance < battle.entry_fee) {
        return cb({ ok: false, error: 'Saldo insuficiente' });
      }

      // Cobrar e entrar
      vRP.removeMoney(userId, battle.entry_fee);
      await conn.execute(
        `INSERT INTO casino_cases_battle_players (battle_id, user_id) VALUES (?, ?)`,
        [battleId, userId]
      );
      await conn.execute(
        `UPDATE casino_cases_battles SET total_pot = total_pot + ? WHERE id = ?`,
        [battle.entry_fee, battleId]
      );

      await conn.execute(
        `INSERT INTO casino_cases_audit (user_id, action, details) VALUES (?, 'battle_join', ?)`,
        [userId, JSON.stringify({ battle_id: battleId, entry_fee: battle.entry_fee })]
      );

      // Verificar se lotou -> iniciar
      const newCount = playerCount + 1;
      if (newCount >= battle.max_players) {
        await conn.execute(`UPDATE casino_cases_battles SET status = 'in_progress' WHERE id = ?`, [battleId]);

        // Gerar resultados para TODOS os jogadores
        const [players] = await conn.execute(
          'SELECT user_id FROM casino_cases_battle_players WHERE battle_id = ?', [battleId]
        );
        const caseSequence = JSON.parse(battle.case_sequence);
        const battleResults = [];

        for (const player of players) {
          let playerTotal = 0;
          const playerItems = [];

          for (let ci = 0; ci < caseSequence.length; ci++) {
            const csId = caseSequence[ci];
            const [items] = await conn.execute(
              'SELECT * FROM casino_case_items WHERE case_id = ? AND is_active = 1', [csId]
            );

            // Provably Fair por jogador por caixa
            const nonce = Date.now() + ci * 1000 + player.user_id;
            const hash = crypto.createHash('sha256')
              .update(`${SERVER_SEED}:${player.user_id}:${csId}:${nonce}:battle:${battleId}`).digest('hex');
            const roll = (parseInt(hash.substring(0, 8), 16) / 0xFFFFFFFF) * 100;

            let cum = 0, selItem = items[0];
            for (const it of items) {
              cum += parseFloat(it.probability);
              if (roll <= cum) { selItem = it; break; }
            }

            playerTotal += parseFloat(selItem.value);
            playerItems.push({ caseIndex: ci, item: selItem });
          }

          battleResults.push({ userId: player.user_id, totalValue: playerTotal, items: playerItems });
        }

        // Determinar vencedor
        battleResults.sort((a, b) => b.totalValue - a.totalValue);
        const winner = battleResults[0];
        const houseFee = parseFloat(battle.total_pot) * (parseFloat(battle.house_fee_pct) / 100);

        // Finalizar batalha
        await conn.execute(
          `UPDATE casino_cases_battles SET status = 'finished', winner_id = ?, finished_at = NOW() WHERE id = ?`,
          [winner.userId, battleId]
        );

        // Atualizar ranks
        for (let ri = 0; ri < battleResults.length; ri++) {
          await conn.execute(
            `UPDATE casino_cases_battle_players SET total_value = ?, items_won = ?, rank = ? WHERE battle_id = ? AND user_id = ?`,
            [battleResults[ri].totalValue, JSON.stringify(battleResults[ri].items.map(x => x.item.name)), ri + 1, battleId, battleResults[ri].userId]
          );
        }

        // Broadcast resultado
        emitNet('casino:cases:battle_finished', -1, {
          battleId, winner: winner.userId, results: battleResults.map(r => ({
            userId: r.userId, totalValue: r.totalValue, items: r.items.map(x => ({
              name: x.item.name, rarity: x.item.rarity, rarity_color: x.item.rarity_color, value: x.item.value
            }))
          }))
        });

        await conn.execute(
          `INSERT INTO casino_cases_audit (user_id, action, details) VALUES (?, 'battle_finish', ?)`,
          [winner.userId, JSON.stringify({ battle_id: battleId, winner: winner.userId, pot: battle.total_pot, house_fee: houseFee })]
        );
      }

      cb({ ok: true, joined: true, playerCount: newCount, newBalance: vRP.getMoney(userId) });
    } catch (err) {
      console.error('[CASES] battle_join error:', err);
      cb({ ok: false, error: 'Erro ao entrar na batalha' });
    }
  });

  // === HANDLER 11: Listar batalhas abertas ===
  RegisterNuiCallback('casino:cases:battle_list', async (data, cb) => {
    try {
      const [battles] = await conn.execute(
        `SELECT b.*, 
                (SELECT COUNT(*) FROM casino_cases_battle_players WHERE battle_id = b.id) as player_count
         FROM casino_cases_battles b
         WHERE b.status = 'waiting'
         ORDER BY b.created_at DESC LIMIT 20`
      );
      cb({ ok: true, battles });
    } catch (err) {
      cb({ ok: false, error: 'Erro ao listar batalhas' });
    }
  });

  // === HANDLER 12: Resultado de batalha ===
  RegisterNuiCallback('casino:cases:battle_result', async (data, cb) => {
    try {
      const { battleId } = data;
      const [[battle]] = await conn.execute(
        'SELECT * FROM casino_cases_battles WHERE id = ?', [battleId]
      );
      if (!battle) return cb({ ok: false, error: 'Batalha nao encontrada' });

      const [players] = await conn.execute(
        `SELECT bp.*, (SELECT name FROM vrp_users WHERE id = bp.user_id LIMIT 1) as username
         FROM casino_cases_battle_players bp
         WHERE bp.battle_id = ?
         ORDER BY bp.rank ASC`,
        [battleId]
      );
      cb({ ok: true, battle, players });
    } catch (err) {
      cb({ ok: false, error: 'Erro ao carregar resultado' });
    }
  });

}; // fim module.exports

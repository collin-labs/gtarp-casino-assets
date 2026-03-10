-- =====================================================
-- BLACKOUT CASINO -- CASES -- Seeds
-- Sell back: 70% do valor (definido pelo BC)
-- Itens: Novos exclusivos para o Casino
-- Executar APOS o schema
-- =====================================================

-- 6 Caixas
INSERT INTO casino_cases (name, slug, description, price, theme_color, category, max_opens_per_day, sort_order) VALUES
('Arsenal Dourado',   'arsenal-dourado',   'Armas exclusivas do submundo de Los Santos',       500.00,  '#D4A843', 'standard',  0, 1),
('Garagem VIP',       'garagem-vip',       'Veiculos de luxo e esportivos raros',              1000.00, '#00E676', 'premium',   0, 2),
('Pacote Urbano',     'pacote-urbano',     'Mix de itens do dia a dia da cidade',              100.00,  '#4B69FF', 'budget',    0, 3),
('Cofre Secreto',     'cofre-secreto',     'O cofre mais exclusivo do Blackout Casino',        2500.00, '#FFD700', 'premium',   0, 4),
('Caixa Noturna',     'caixa-noturna',     'Itens tematicos da vida noturna de LS',            300.00,  '#D32CE6', 'standard',  0, 5),
('Caixa Diaria',      'caixa-diaria',      'Sua recompensa diaria gratuita!',                  0.00,    '#00E676', 'daily_free', 1, 6);

-- Itens: Arsenal Dourado (case_id = 1) -- sell_back = 70%
INSERT INTO casino_case_items (case_id, name, rarity, rarity_color, value, sell_back_value, probability, item_type, game_item_id, sort_order) VALUES
(1, 'Pistola Tatica',        'common',    '#4B69FF', 100.00,  70.00,   40.000, 'weapon', 'weapon_pistol_mk2',       1),
(1, 'SMG Compacta',          'common',    '#4B69FF', 150.00,  105.00,  25.000, 'weapon', 'weapon_smg_mk2',          2),
(1, 'Carabina MK2',          'uncommon',  '#8847FF', 300.00,  210.00,  15.000, 'weapon', 'weapon_carbinerifle_mk2', 3),
(1, 'Shotgun de Combate',    'uncommon',  '#8847FF', 350.00,  245.00,  10.000, 'weapon', 'weapon_combatshotgun',    4),
(1, 'Sniper Pesada',         'rare',      '#D32CE6', 800.00,  560.00,  5.000,  'weapon', 'weapon_heavysniper_mk2',  5),
(1, 'Minigun Dourada',       'epic',      '#EB4B4B', 2000.00, 1400.00, 3.500,  'weapon', 'weapon_minigun',          6),
(1, 'RPG Edicao Limitada',   'epic',      '#EB4B4B', 3000.00, 2100.00, 1.000,  'weapon', 'weapon_rpg',              7),
(1, 'Railgun Blackout',      'legendary', '#FFD700', 10000.00,7000.00, 0.500,  'weapon', 'weapon_railgun',          8);
-- Soma: 40+25+15+10+5+3.5+1+0.5 = 100.0%

-- Itens: Garagem VIP (case_id = 2)
INSERT INTO casino_case_items (case_id, name, rarity, rarity_color, value, sell_back_value, probability, item_type, game_item_id, sort_order) VALUES
(2, 'Futo GTX',              'common',    '#4B69FF', 200.00,   140.00,   35.000, 'vehicle', 'futo2',          1),
(2, 'Sultan RS',             'common',    '#4B69FF', 350.00,   245.00,   25.000, 'vehicle', 'sultan2',        2),
(2, 'Elegy RH8',            'uncommon',  '#8847FF', 800.00,   560.00,   18.000, 'vehicle', 'elegy2',         3),
(2, 'Jester Classic',       'uncommon',  '#8847FF', 1200.00,  840.00,   10.000, 'vehicle', 'jester3',        4),
(2, 'Itali GTO',            'rare',      '#D32CE6', 3000.00,  2100.00,  6.000,  'vehicle', 'italigto',       5),
(2, 'Thrax',                'rare',      '#D32CE6', 4500.00,  3150.00,  3.000,  'vehicle', 'thrax',          6),
(2, 'Tezeract',             'epic',      '#EB4B4B', 8000.00,  5600.00,  2.000,  'vehicle', 'tezeract',       7),
(2, 'Scramjet Dourado',     'legendary', '#FFD700', 25000.00, 17500.00, 1.000,  'vehicle', 'scramjet',       8);
-- Soma: 35+25+18+10+6+3+2+1 = 100.0%

-- Itens: Pacote Urbano (case_id = 3)
INSERT INTO casino_case_items (case_id, name, rarity, rarity_color, value, sell_back_value, probability, item_type, sort_order) VALUES
(3, 'R$ 50 em GCoin',         'common',    '#4B69FF', 50.00,   35.00,   45.000, 'money',    1),
(3, 'R$ 150 em GCoin',        'common',    '#4B69FF', 150.00,  105.00,  25.000, 'money',    2),
(3, 'Kit Medico Premium',     'uncommon',  '#8847FF', 200.00,  140.00,  15.000, 'cosmetic', 3),
(3, 'Roupa Grife Exclusiva',  'uncommon',  '#8847FF', 300.00,  210.00,  8.000,  'clothing', 4),
(3, 'R$ 500 em GCoin',        'rare',      '#D32CE6', 500.00,  350.00,  4.000,  'money',    5),
(3, 'Passe VIP 7 dias',       'epic',      '#EB4B4B', 1000.00, 700.00,  2.500,  'vip',      6),
(3, 'R$ 2.000 em GCoin',      'legendary', '#FFD700', 2000.00, 1400.00, 0.500,  'money',    7);
-- Soma: 45+25+15+8+4+2.5+0.5 = 100.0%

-- Itens: Cofre Secreto (case_id = 4) -- premium, itens valiosos
INSERT INTO casino_case_items (case_id, name, rarity, rarity_color, value, sell_back_value, probability, item_type, game_item_id, sort_order) VALUES
(4, 'Colete Ballistico Gold',  'common',    '#4B69FF', 500.00,   350.00,   30.000, 'cosmetic', NULL,             1),
(4, 'Kit Armamento Completo',  'uncommon',  '#8847FF', 1500.00,  1050.00,  25.000, 'weapon',   NULL,             2),
(4, 'Blazer Aqua',            'uncommon',  '#8847FF', 2000.00,  1400.00,  18.000, 'vehicle',  'blazer4',        3),
(4, 'Visser Dourado',         'rare',      '#D32CE6', 5000.00,  3500.00,  12.000, 'vehicle',  'visione',        4),
(4, 'Passe VIP 30 dias',      'rare',      '#D32CE6', 4000.00,  2800.00,  8.000,  'vip',      NULL,             5),
(4, 'Oppressor MK2 Gold',     'epic',      '#EB4B4B', 15000.00, 10500.00, 4.000,  'vehicle',  'oppressor2',     6),
(4, 'Deluxo Blackout Edition', 'epic',      '#EB4B4B', 20000.00, 14000.00, 2.500,  'vehicle',  'deluxo',         7),
(4, 'Lazer Dourado',          'legendary', '#FFD700', 50000.00, 35000.00, 0.500,  'vehicle',  'lazer',          8);
-- Soma: 30+25+18+12+8+4+2.5+0.5 = 100.0%

-- Itens: Caixa Noturna (case_id = 5)
INSERT INTO casino_case_items (case_id, name, rarity, rarity_color, value, sell_back_value, probability, item_type, sort_order) VALUES
(5, 'Champagne Blackout',     'common',    '#4B69FF', 50.00,   35.00,   40.000, 'cosmetic', 1),
(5, 'Terno Escuro Premium',   'common',    '#4B69FF', 100.00,  70.00,   25.000, 'clothing', 2),
(5, 'Relogio Dourado',        'uncommon',  '#8847FF', 250.00,  175.00,  15.000, 'cosmetic', 3),
(5, 'Oculos Neon VIP',        'uncommon',  '#8847FF', 300.00,  210.00,  10.000, 'cosmetic', 4),
(5, 'Cadeia Diamante',        'rare',      '#D32CE6', 800.00,  560.00,  5.000,  'cosmetic', 5),
(5, 'Passe Camarote 7 dias',  'epic',      '#EB4B4B', 1500.00, 1050.00, 3.500,  'vip',      6),
(5, 'Mascara Neon Exclusiva', 'epic',      '#EB4B4B', 2000.00, 1400.00, 1.000,  'cosmetic', 7),
(5, 'Skin Diamante Completa', 'legendary', '#FFD700', 5000.00, 3500.00, 0.500,  'cosmetic', 8);
-- Soma: 40+25+15+10+5+3.5+1+0.5 = 100.0%

-- Itens: Caixa Diaria (case_id = 6) -- gratis, itens modestos
INSERT INTO casino_case_items (case_id, name, rarity, rarity_color, value, sell_back_value, probability, item_type, sort_order) VALUES
(6, 'R$ 10 em GCoin',     'common',   '#4B69FF', 10.00,  7.00,    50.000, 'money', 1),
(6, 'R$ 25 em GCoin',     'common',   '#4B69FF', 25.00,  17.50,   30.000, 'money', 2),
(6, 'R$ 50 em GCoin',     'uncommon', '#8847FF', 50.00,  35.00,   12.000, 'money', 3),
(6, 'R$ 100 em GCoin',    'rare',     '#D32CE6', 100.00, 70.00,   5.000,  'money', 4),
(6, 'R$ 250 em GCoin',    'epic',     '#EB4B4B', 250.00, 175.00,  2.500,  'money', 5),
(6, 'R$ 500 em GCoin',    'legendary','#FFD700', 500.00, 350.00,  0.500,  'money', 6);
-- Soma: 50+30+12+5+2.5+0.5 = 100.0%

-- Historico mock
INSERT INTO casino_cases_openings (user_id, case_id, item_id, price_paid, item_value, hash, seed_nonce, is_free, action, created_at) VALUES
(1, 1, 3, 500.00, 300.00, 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2', 1709769600001, 0, 'kept', NOW() - INTERVAL 2 HOUR),
(2, 3, 17, 100.00, 50.00,  'b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3', 1709769600002, 0, 'sold', NOW() - INTERVAL 1 HOUR),
(3, 1, 8, 500.00, 10000.00,'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4', 1709769600003, 0, 'kept', NOW() - INTERVAL 30 MINUTE),
(4, 6, 44, 0.00, 100.00,   'd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5', 1709769600004, 1, 'kept', NOW() - INTERVAL 15 MINUTE),
(5, 2, 15, 1000.00, 3000.00,'e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6', 1709769600005, 0, 'pending', NOW() - INTERVAL 5 MINUTE);

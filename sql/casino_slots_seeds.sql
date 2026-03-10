-- ═══════════════════════════════════════════════════════════════
-- BLACKOUT CASINO — SLOTS ENGINE — Seeds (Dados Iniciais)
-- Executar APÓS o schema. Banco: kushstore (MariaDB)
-- Data: 04/03/2026
-- ═══════════════════════════════════════════════════════════════

-- ──────────────────────────────────────────────────────
-- 1. CONFIG INICIAL
-- ──────────────────────────────────────────────────────
INSERT INTO casino_slots_config (mode, min_bet, max_bet, rtp_profile, free_spins_cost_multiplier)
VALUES
  ('classic', 5.00, 2000.00, 'default', 25),
  ('video',  10.00, 5000.00, 'default', 25);

-- ──────────────────────────────────────────────────────
-- 2. PAYTABLE CLASSIC "777 Gold"
--    3 iguais na payline = payout_multiplier × aposta
-- ──────────────────────────────────────────────────────
INSERT INTO casino_slots_paytable (mode, symbol, count, payout_multiplier, symbol_type, display_order) VALUES
  ('classic', 'diamante',    3, 200.00, 'premium', 1),
  ('classic', '777',         3, 100.00, 'premium', 2),
  ('classic', 'bar_triplo',  3,  50.00, 'premium', 3),
  ('classic', 'sino',        3,  25.00, 'mid',     4),
  ('classic', 'estrela',     3,  15.00, 'mid',     5),
  ('classic', 'cereja',      3,  10.00, 'low',     6),
  ('classic', 'limao',       3,   5.00, 'low',     7),
  ('classic', 'cereja',      2,   2.00, 'low',     8);

-- ──────────────────────────────────────────────────────
-- 3. PAYTABLE VIDEO "Blackout Fortune"
--    Cluster Pays: 5+, 8+, 12+, 15+, 20+ adjacentes
-- ──────────────────────────────────────────────────────
INSERT INTO casino_slots_paytable (mode, symbol, count, payout_multiplier, symbol_type, display_order) VALUES
  -- Cálice (Premium 1)
  ('video', 'calice',    5,  2.00, 'premium', 1),
  ('video', 'calice',    8,  5.00, 'premium', 2),
  ('video', 'calice',   12, 20.00, 'premium', 3),
  ('video', 'calice',   15, 50.00, 'premium', 4),
  ('video', 'calice',   20,200.00, 'premium', 5),
  -- Dados (Premium 2)
  ('video', 'dados',     5,  1.50, 'premium', 6),
  ('video', 'dados',     8,  4.00, 'premium', 7),
  ('video', 'dados',    12, 15.00, 'premium', 8),
  ('video', 'dados',    15, 40.00, 'premium', 9),
  ('video', 'dados',    20,150.00, 'premium', 10),
  -- Ficha (Premium 3)
  ('video', 'ficha',     5,  1.00, 'premium', 11),
  ('video', 'ficha',     8,  3.00, 'premium', 12),
  ('video', 'ficha',    12, 10.00, 'premium', 13),
  ('video', 'ficha',    15, 30.00, 'premium', 14),
  ('video', 'ficha',    20,100.00, 'premium', 15),
  -- Rubi (Mid 1)
  ('video', 'rubi',      5,  0.50, 'mid', 16),
  ('video', 'rubi',      8,  2.00, 'mid', 17),
  ('video', 'rubi',     12,  5.00, 'mid', 18),
  ('video', 'rubi',     15, 15.00, 'mid', 19),
  ('video', 'rubi',     20, 50.00, 'mid', 20),
  -- Esmeralda (Mid 2)
  ('video', 'esmeralda', 5,  0.50, 'mid', 21),
  ('video', 'esmeralda', 8,  2.00, 'mid', 22),
  ('video', 'esmeralda',12,  5.00, 'mid', 23),
  ('video', 'esmeralda',15, 15.00, 'mid', 24),
  ('video', 'esmeralda',20, 50.00, 'mid', 25),
  -- A (Low 1)
  ('video', 'A',         5,  0.30, 'low', 26),
  ('video', 'A',         8,  1.00, 'low', 27),
  ('video', 'A',        12,  3.00, 'low', 28),
  ('video', 'A',        15,  5.00, 'low', 29),
  ('video', 'A',        20, 20.00, 'low', 30),
  -- K (Low 2)
  ('video', 'K',         5,  0.30, 'low', 31),
  ('video', 'K',         8,  1.00, 'low', 32),
  ('video', 'K',        12,  3.00, 'low', 33),
  ('video', 'K',        15,  5.00, 'low', 34),
  ('video', 'K',        20, 20.00, 'low', 35),
  -- Q (Low 3)
  ('video', 'Q',         5,  0.20, 'low', 36),
  ('video', 'Q',         8,  0.60, 'low', 37),
  ('video', 'Q',        12,  2.00, 'low', 38),
  ('video', 'Q',        15,  3.00, 'low', 39),
  ('video', 'Q',        20, 10.00, 'low', 40),
  -- J (Low 4)
  ('video', 'J',         5,  0.20, 'low', 41),
  ('video', 'J',         8,  0.60, 'low', 42),
  ('video', 'J',        12,  2.00, 'low', 43),
  ('video', 'J',        15,  3.00, 'low', 44),
  ('video', 'J',        20, 10.00, 'low', 45),
  -- 10 (Low 5)
  ('video', '10',        5,  0.20, 'low', 46),
  ('video', '10',        8,  0.50, 'low', 47),
  ('video', '10',       12,  1.50, 'low', 48),
  ('video', '10',       15,  2.00, 'low', 49),
  ('video', '10',       20,  5.00, 'low', 50);

-- ──────────────────────────────────────────────────────
-- 4. REEL STRIPS — CLASSIC "777 Gold" (profile: default)
--    3 reels × 64 stops cada
--    Distribuição de pesos (conforme Mega Estudo):
--      diamante: 2, 777: 3, bar_triplo: 4, sino: 6,
--      estrela: 8, cereja: 10, limao: 12, blank: 19
-- ──────────────────────────────────────────────────────

-- Procedimento para gerar strips a partir dos pesos
-- Cada reel tem a mesma distribuição base (variações futuras por reel)

-- REEL 0 (Classic)
INSERT INTO casino_slots_reel_strips (mode, rtp_profile, reel_index, position, symbol) VALUES
('classic','default',0, 0,'blank'),('classic','default',0, 1,'limao'),('classic','default',0, 2,'blank'),
('classic','default',0, 3,'cereja'),('classic','default',0, 4,'limao'),('classic','default',0, 5,'estrela'),
('classic','default',0, 6,'blank'),('classic','default',0, 7,'limao'),('classic','default',0, 8,'cereja'),
('classic','default',0, 9,'sino'),('classic','default',0,10,'blank'),('classic','default',0,11,'estrela'),
('classic','default',0,12,'limao'),('classic','default',0,13,'cereja'),('classic','default',0,14,'blank'),
('classic','default',0,15,'bar_triplo'),('classic','default',0,16,'estrela'),('classic','default',0,17,'limao'),
('classic','default',0,18,'blank'),('classic','default',0,19,'cereja'),('classic','default',0,20,'sino'),
('classic','default',0,21,'limao'),('classic','default',0,22,'estrela'),('classic','default',0,23,'blank'),
('classic','default',0,24,'cereja'),('classic','default',0,25,'limao'),('classic','default',0,26,'777'),
('classic','default',0,27,'blank'),('classic','default',0,28,'estrela'),('classic','default',0,29,'cereja'),
('classic','default',0,30,'limao'),('classic','default',0,31,'sino'),('classic','default',0,32,'blank'),
('classic','default',0,33,'cereja'),('classic','default',0,34,'limao'),('classic','default',0,35,'estrela'),
('classic','default',0,36,'blank'),('classic','default',0,37,'bar_triplo'),('classic','default',0,38,'cereja'),
('classic','default',0,39,'limao'),('classic','default',0,40,'blank'),('classic','default',0,41,'sino'),
('classic','default',0,42,'estrela'),('classic','default',0,43,'cereja'),('classic','default',0,44,'limao'),
('classic','default',0,45,'blank'),('classic','default',0,46,'bar_triplo'),('classic','default',0,47,'estrela'),
('classic','default',0,48,'diamante'),('classic','default',0,49,'blank'),('classic','default',0,50,'limao'),
('classic','default',0,51,'cereja'),('classic','default',0,52,'sino'),('classic','default',0,53,'blank'),
('classic','default',0,54,'777'),('classic','default',0,55,'limao'),('classic','default',0,56,'estrela'),
('classic','default',0,57,'blank'),('classic','default',0,58,'bar_triplo'),('classic','default',0,59,'sino'),
('classic','default',0,60,'diamante'),('classic','default',0,61,'blank'),('classic','default',0,62,'limao'),
('classic','default',0,63,'777');

-- REEL 1 (Classic) — mesma distribuição, ordem diferente
INSERT INTO casino_slots_reel_strips (mode, rtp_profile, reel_index, position, symbol) VALUES
('classic','default',1, 0,'limao'),('classic','default',1, 1,'blank'),('classic','default',1, 2,'cereja'),
('classic','default',1, 3,'estrela'),('classic','default',1, 4,'blank'),('classic','default',1, 5,'limao'),
('classic','default',1, 6,'sino'),('classic','default',1, 7,'cereja'),('classic','default',1, 8,'blank'),
('classic','default',1, 9,'limao'),('classic','default',1,10,'estrela'),('classic','default',1,11,'bar_triplo'),
('classic','default',1,12,'blank'),('classic','default',1,13,'cereja'),('classic','default',1,14,'limao'),
('classic','default',1,15,'blank'),('classic','default',1,16,'estrela'),('classic','default',1,17,'cereja'),
('classic','default',1,18,'limao'),('classic','default',1,19,'blank'),('classic','default',1,20,'sino'),
('classic','default',1,21,'limao'),('classic','default',1,22,'blank'),('classic','default',1,23,'cereja'),
('classic','default',1,24,'estrela'),('classic','default',1,25,'777'),('classic','default',1,26,'blank'),
('classic','default',1,27,'limao'),('classic','default',1,28,'cereja'),('classic','default',1,29,'blank'),
('classic','default',1,30,'bar_triplo'),('classic','default',1,31,'estrela'),('classic','default',1,32,'limao'),
('classic','default',1,33,'blank'),('classic','default',1,34,'sino'),('classic','default',1,35,'cereja'),
('classic','default',1,36,'blank'),('classic','default',1,37,'limao'),('classic','default',1,38,'estrela'),
('classic','default',1,39,'diamante'),('classic','default',1,40,'blank'),('classic','default',1,41,'limao'),
('classic','default',1,42,'cereja'),('classic','default',1,43,'bar_triplo'),('classic','default',1,44,'blank'),
('classic','default',1,45,'estrela'),('classic','default',1,46,'limao'),('classic','default',1,47,'sino'),
('classic','default',1,48,'blank'),('classic','default',1,49,'cereja'),('classic','default',1,50,'limao'),
('classic','default',1,51,'777'),('classic','default',1,52,'blank'),('classic','default',1,53,'estrela'),
('classic','default',1,54,'limao'),('classic','default',1,55,'blank'),('classic','default',1,56,'cereja'),
('classic','default',1,57,'sino'),('classic','default',1,58,'bar_triplo'),('classic','default',1,59,'blank'),
('classic','default',1,60,'diamante'),('classic','default',1,61,'limao'),('classic','default',1,62,'estrela'),
('classic','default',1,63,'777');

-- REEL 2 (Classic) — mesma distribuição, ordem diferente
INSERT INTO casino_slots_reel_strips (mode, rtp_profile, reel_index, position, symbol) VALUES
('classic','default',2, 0,'blank'),('classic','default',2, 1,'cereja'),('classic','default',2, 2,'limao'),
('classic','default',2, 3,'blank'),('classic','default',2, 4,'estrela'),('classic','default',2, 5,'sino'),
('classic','default',2, 6,'limao'),('classic','default',2, 7,'blank'),('classic','default',2, 8,'cereja'),
('classic','default',2, 9,'bar_triplo'),('classic','default',2,10,'blank'),('classic','default',2,11,'limao'),
('classic','default',2,12,'estrela'),('classic','default',2,13,'cereja'),('classic','default',2,14,'blank'),
('classic','default',2,15,'limao'),('classic','default',2,16,'777'),('classic','default',2,17,'cereja'),
('classic','default',2,18,'blank'),('classic','default',2,19,'estrela'),('classic','default',2,20,'limao'),
('classic','default',2,21,'sino'),('classic','default',2,22,'blank'),('classic','default',2,23,'cereja'),
('classic','default',2,24,'limao'),('classic','default',2,25,'blank'),('classic','default',2,26,'bar_triplo'),
('classic','default',2,27,'estrela'),('classic','default',2,28,'cereja'),('classic','default',2,29,'limao'),
('classic','default',2,30,'blank'),('classic','default',2,31,'sino'),('classic','default',2,32,'limao'),
('classic','default',2,33,'blank'),('classic','default',2,34,'cereja'),('classic','default',2,35,'diamante'),
('classic','default',2,36,'estrela'),('classic','default',2,37,'blank'),('classic','default',2,38,'limao'),
('classic','default',2,39,'cereja'),('classic','default',2,40,'blank'),('classic','default',2,41,'bar_triplo'),
('classic','default',2,42,'limao'),('classic','default',2,43,'estrela'),('classic','default',2,44,'blank'),
('classic','default',2,45,'sino'),('classic','default',2,46,'cereja'),('classic','default',2,47,'blank'),
('classic','default',2,48,'limao'),('classic','default',2,49,'estrela'),('classic','default',2,50,'777'),
('classic','default',2,51,'blank'),('classic','default',2,52,'cereja'),('classic','default',2,53,'limao'),
('classic','default',2,54,'bar_triplo'),('classic','default',2,55,'blank'),('classic','default',2,56,'sino'),
('classic','default',2,57,'estrela'),('classic','default',2,58,'blank'),('classic','default',2,59,'limao'),
('classic','default',2,60,'cereja'),('classic','default',2,61,'diamante'),('classic','default',2,62,'blank'),
('classic','default',2,63,'777');

-- ──────────────────────────────────────────────────────
-- 5. REEL STRIPS — VIDEO "Blackout Fortune" (profile: default)
--    6 reels × 96 stops cada
--    Distribuição por reel:
--      wild: 3, scatter: 4, calice: 5, dados: 5, ficha: 6,
--      rubi: 8, esmeralda: 8, A: 10, K: 11, Q: 12, J: 12, 10: 12
--    Total: 96
-- ──────────────────────────────────────────────────────

-- Geração procedural — cada reel tem a mesma distribuição com shuffle diferente
-- Para economizar espaço, usamos INSERT em lote

-- REEL 0 (Video)
INSERT INTO casino_slots_reel_strips (mode, rtp_profile, reel_index, position, symbol) VALUES
('video','default',0, 0,'10'),('video','default',0, 1,'Q'),('video','default',0, 2,'rubi'),
('video','default',0, 3,'J'),('video','default',0, 4,'K'),('video','default',0, 5,'esmeralda'),
('video','default',0, 6,'10'),('video','default',0, 7,'A'),('video','default',0, 8,'Q'),
('video','default',0, 9,'ficha'),('video','default',0,10,'J'),('video','default',0,11,'K'),
('video','default',0,12,'10'),('video','default',0,13,'rubi'),('video','default',0,14,'Q'),
('video','default',0,15,'calice'),('video','default',0,16,'J'),('video','default',0,17,'A'),
('video','default',0,18,'K'),('video','default',0,19,'esmeralda'),('video','default',0,20,'10'),
('video','default',0,21,'Q'),('video','default',0,22,'dados'),('video','default',0,23,'J'),
('video','default',0,24,'scatter'),('video','default',0,25,'K'),('video','default',0,26,'A'),
('video','default',0,27,'rubi'),('video','default',0,28,'10'),('video','default',0,29,'Q'),
('video','default',0,30,'J'),('video','default',0,31,'ficha'),('video','default',0,32,'esmeralda'),
('video','default',0,33,'K'),('video','default',0,34,'A'),('video','default',0,35,'10'),
('video','default',0,36,'Q'),('video','default',0,37,'J'),('video','default',0,38,'wild'),
('video','default',0,39,'rubi'),('video','default',0,40,'K'),('video','default',0,41,'10'),
('video','default',0,42,'A'),('video','default',0,43,'Q'),('video','default',0,44,'calice'),
('video','default',0,45,'J'),('video','default',0,46,'esmeralda'),('video','default',0,47,'K'),
('video','default',0,48,'10'),('video','default',0,49,'rubi'),('video','default',0,50,'scatter'),
('video','default',0,51,'A'),('video','default',0,52,'Q'),('video','default',0,53,'J'),
('video','default',0,54,'dados'),('video','default',0,55,'K'),('video','default',0,56,'10'),
('video','default',0,57,'ficha'),('video','default',0,58,'A'),('video','default',0,59,'rubi'),
('video','default',0,60,'Q'),('video','default',0,61,'J'),('video','default',0,62,'esmeralda'),
('video','default',0,63,'K'),('video','default',0,64,'calice'),('video','default',0,65,'10'),
('video','default',0,66,'A'),('video','default',0,67,'Q'),('video','default',0,68,'J'),
('video','default',0,69,'rubi'),('video','default',0,70,'wild'),('video','default',0,71,'K'),
('video','default',0,72,'10'),('video','default',0,73,'esmeralda'),('video','default',0,74,'A'),
('video','default',0,75,'Q'),('video','default',0,76,'ficha'),('video','default',0,77,'J'),
('video','default',0,78,'dados'),('video','default',0,79,'K'),('video','default',0,80,'scatter'),
('video','default',0,81,'10'),('video','default',0,82,'rubi'),('video','default',0,83,'A'),
('video','default',0,84,'Q'),('video','default',0,85,'J'),('video','default',0,86,'calice'),
('video','default',0,87,'esmeralda'),('video','default',0,88,'K'),('video','default',0,89,'ficha'),
('video','default',0,90,'10'),('video','default',0,91,'A'),('video','default',0,92,'scatter'),
('video','default',0,93,'wild'),('video','default',0,94,'dados'),('video','default',0,95,'rubi');

-- REELS 1-5 (Video) — Mesmo padrão com shuffle diferente
-- Para cada reel, rotacionamos os símbolos por offsets diferentes

INSERT INTO casino_slots_reel_strips (mode, rtp_profile, reel_index, position, symbol) VALUES
('video','default',1, 0,'K'),('video','default',1, 1,'rubi'),('video','default',1, 2,'10'),
('video','default',1, 3,'A'),('video','default',1, 4,'Q'),('video','default',1, 5,'J'),
('video','default',1, 6,'esmeralda'),('video','default',1, 7,'ficha'),('video','default',1, 8,'K'),
('video','default',1, 9,'10'),('video','default',1,10,'scatter'),('video','default',1,11,'Q'),
('video','default',1,12,'J'),('video','default',1,13,'A'),('video','default',1,14,'rubi'),
('video','default',1,15,'10'),('video','default',1,16,'K'),('video','default',1,17,'calice'),
('video','default',1,18,'J'),('video','default',1,19,'Q'),('video','default',1,20,'esmeralda'),
('video','default',1,21,'A'),('video','default',1,22,'10'),('video','default',1,23,'K'),
('video','default',1,24,'dados'),('video','default',1,25,'J'),('video','default',1,26,'rubi'),
('video','default',1,27,'Q'),('video','default',1,28,'10'),('video','default',1,29,'wild'),
('video','default',1,30,'A'),('video','default',1,31,'K'),('video','default',1,32,'ficha'),
('video','default',1,33,'J'),('video','default',1,34,'Q'),('video','default',1,35,'esmeralda'),
('video','default',1,36,'10'),('video','default',1,37,'rubi'),('video','default',1,38,'A'),
('video','default',1,39,'K'),('video','default',1,40,'calice'),('video','default',1,41,'J'),
('video','default',1,42,'Q'),('video','default',1,43,'10'),('video','default',1,44,'scatter'),
('video','default',1,45,'A'),('video','default',1,46,'dados'),('video','default',1,47,'rubi'),
('video','default',1,48,'K'),('video','default',1,49,'esmeralda'),('video','default',1,50,'J'),
('video','default',1,51,'10'),('video','default',1,52,'Q'),('video','default',1,53,'ficha'),
('video','default',1,54,'A'),('video','default',1,55,'K'),('video','default',1,56,'rubi'),
('video','default',1,57,'wild'),('video','default',1,58,'10'),('video','default',1,59,'J'),
('video','default',1,60,'Q'),('video','default',1,61,'calice'),('video','default',1,62,'esmeralda'),
('video','default',1,63,'A'),('video','default',1,64,'K'),('video','default',1,65,'10'),
('video','default',1,66,'dados'),('video','default',1,67,'rubi'),('video','default',1,68,'J'),
('video','default',1,69,'scatter'),('video','default',1,70,'Q'),('video','default',1,71,'ficha'),
('video','default',1,72,'A'),('video','default',1,73,'K'),('video','default',1,74,'10'),
('video','default',1,75,'esmeralda'),('video','default',1,76,'J'),('video','default',1,77,'rubi'),
('video','default',1,78,'Q'),('video','default',1,79,'calice'),('video','default',1,80,'A'),
('video','default',1,81,'K'),('video','default',1,82,'wild'),('video','default',1,83,'10'),
('video','default',1,84,'J'),('video','default',1,85,'scatter'),('video','default',1,86,'dados'),
('video','default',1,87,'Q'),('video','default',1,88,'rubi'),('video','default',1,89,'esmeralda'),
('video','default',1,90,'A'),('video','default',1,91,'ficha'),('video','default',1,92,'10'),
('video','default',1,93,'K'),('video','default',1,94,'J'),('video','default',1,95,'Q');

-- REEL 2 (Video)
INSERT INTO casino_slots_reel_strips (mode, rtp_profile, reel_index, position, symbol) VALUES
('video','default',2, 0,'J'),('video','default',2, 1,'A'),('video','default',2, 2,'esmeralda'),
('video','default',2, 3,'10'),('video','default',2, 4,'K'),('video','default',2, 5,'Q'),
('video','default',2, 6,'rubi'),('video','default',2, 7,'ficha'),('video','default',2, 8,'J'),
('video','default',2, 9,'10'),('video','default',2,10,'calice'),('video','default',2,11,'A'),
('video','default',2,12,'Q'),('video','default',2,13,'K'),('video','default',2,14,'esmeralda'),
('video','default',2,15,'J'),('video','default',2,16,'scatter'),('video','default',2,17,'10'),
('video','default',2,18,'rubi'),('video','default',2,19,'A'),('video','default',2,20,'Q'),
('video','default',2,21,'dados'),('video','default',2,22,'K'),('video','default',2,23,'J'),
('video','default',2,24,'10'),('video','default',2,25,'wild'),('video','default',2,26,'esmeralda'),
('video','default',2,27,'A'),('video','default',2,28,'ficha'),('video','default',2,29,'Q'),
('video','default',2,30,'K'),('video','default',2,31,'rubi'),('video','default',2,32,'J'),
('video','default',2,33,'10'),('video','default',2,34,'A'),('video','default',2,35,'calice'),
('video','default',2,36,'Q'),('video','default',2,37,'esmeralda'),('video','default',2,38,'K'),
('video','default',2,39,'J'),('video','default',2,40,'scatter'),('video','default',2,41,'10'),
('video','default',2,42,'rubi'),('video','default',2,43,'dados'),('video','default',2,44,'A'),
('video','default',2,45,'Q'),('video','default',2,46,'K'),('video','default',2,47,'ficha'),
('video','default',2,48,'J'),('video','default',2,49,'10'),('video','default',2,50,'esmeralda'),
('video','default',2,51,'A'),('video','default',2,52,'rubi'),('video','default',2,53,'Q'),
('video','default',2,54,'K'),('video','default',2,55,'calice'),('video','default',2,56,'J'),
('video','default',2,57,'10'),('video','default',2,58,'wild'),('video','default',2,59,'A'),
('video','default',2,60,'Q'),('video','default',2,61,'esmeralda'),('video','default',2,62,'K'),
('video','default',2,63,'rubi'),('video','default',2,64,'scatter'),('video','default',2,65,'J'),
('video','default',2,66,'10'),('video','default',2,67,'ficha'),('video','default',2,68,'A'),
('video','default',2,69,'dados'),('video','default',2,70,'Q'),('video','default',2,71,'K'),
('video','default',2,72,'J'),('video','default',2,73,'rubi'),('video','default',2,74,'10'),
('video','default',2,75,'esmeralda'),('video','default',2,76,'wild'),('video','default',2,77,'A'),
('video','default',2,78,'calice'),('video','default',2,79,'Q'),('video','default',2,80,'K'),
('video','default',2,81,'J'),('video','default',2,82,'scatter'),('video','default',2,83,'10'),
('video','default',2,84,'ficha'),('video','default',2,85,'rubi'),('video','default',2,86,'A'),
('video','default',2,87,'dados'),('video','default',2,88,'Q'),('video','default',2,89,'esmeralda'),
('video','default',2,90,'K'),('video','default',2,91,'J'),('video','default',2,92,'10'),
('video','default',2,93,'A'),('video','default',2,94,'rubi'),('video','default',2,95,'calice');

-- REEL 3 (Video)
INSERT INTO casino_slots_reel_strips (mode, rtp_profile, reel_index, position, symbol) VALUES
('video','default',3, 0,'Q'),('video','default',3, 1,'10'),('video','default',3, 2,'K'),
('video','default',3, 3,'rubi'),('video','default',3, 4,'J'),('video','default',3, 5,'A'),
('video','default',3, 6,'esmeralda'),('video','default',3, 7,'Q'),('video','default',3, 8,'calice'),
('video','default',3, 9,'10'),('video','default',3,10,'K'),('video','default',3,11,'J'),
('video','default',3,12,'ficha'),('video','default',3,13,'A'),('video','default',3,14,'rubi'),
('video','default',3,15,'Q'),('video','default',3,16,'10'),('video','default',3,17,'scatter'),
('video','default',3,18,'K'),('video','default',3,19,'J'),('video','default',3,20,'esmeralda'),
('video','default',3,21,'A'),('video','default',3,22,'dados'),('video','default',3,23,'Q'),
('video','default',3,24,'10'),('video','default',3,25,'rubi'),('video','default',3,26,'K'),
('video','default',3,27,'wild'),('video','default',3,28,'J'),('video','default',3,29,'A'),
('video','default',3,30,'Q'),('video','default',3,31,'ficha'),('video','default',3,32,'10'),
('video','default',3,33,'esmeralda'),('video','default',3,34,'K'),('video','default',3,35,'calice'),
('video','default',3,36,'J'),('video','default',3,37,'rubi'),('video','default',3,38,'A'),
('video','default',3,39,'Q'),('video','default',3,40,'10'),('video','default',3,41,'K'),
('video','default',3,42,'scatter'),('video','default',3,43,'J'),('video','default',3,44,'dados'),
('video','default',3,45,'esmeralda'),('video','default',3,46,'A'),('video','default',3,47,'Q'),
('video','default',3,48,'ficha'),('video','default',3,49,'rubi'),('video','default',3,50,'10'),
('video','default',3,51,'K'),('video','default',3,52,'J'),('video','default',3,53,'calice'),
('video','default',3,54,'A'),('video','default',3,55,'Q'),('video','default',3,56,'wild'),
('video','default',3,57,'esmeralda'),('video','default',3,58,'10'),('video','default',3,59,'K'),
('video','default',3,60,'rubi'),('video','default',3,61,'J'),('video','default',3,62,'scatter'),
('video','default',3,63,'A'),('video','default',3,64,'dados'),('video','default',3,65,'Q'),
('video','default',3,66,'10'),('video','default',3,67,'ficha'),('video','default',3,68,'K'),
('video','default',3,69,'J'),('video','default',3,70,'rubi'),('video','default',3,71,'esmeralda'),
('video','default',3,72,'A'),('video','default',3,73,'wild'),('video','default',3,74,'Q'),
('video','default',3,75,'calice'),('video','default',3,76,'10'),('video','default',3,77,'K'),
('video','default',3,78,'J'),('video','default',3,79,'scatter'),('video','default',3,80,'rubi'),
('video','default',3,81,'A'),('video','default',3,82,'esmeralda'),('video','default',3,83,'ficha'),
('video','default',3,84,'Q'),('video','default',3,85,'10'),('video','default',3,86,'K'),
('video','default',3,87,'dados'),('video','default',3,88,'J'),('video','default',3,89,'rubi'),
('video','default',3,90,'A'),('video','default',3,91,'Q'),('video','default',3,92,'calice'),
('video','default',3,93,'esmeralda'),('video','default',3,94,'10'),('video','default',3,95,'K');

-- REEL 4 (Video)
INSERT INTO casino_slots_reel_strips (mode, rtp_profile, reel_index, position, symbol) VALUES
('video','default',4, 0,'A'),('video','default',4, 1,'J'),('video','default',4, 2,'Q'),
('video','default',4, 3,'esmeralda'),('video','default',4, 4,'K'),('video','default',4, 5,'10'),
('video','default',4, 6,'rubi'),('video','default',4, 7,'calice'),('video','default',4, 8,'A'),
('video','default',4, 9,'J'),('video','default',4,10,'Q'),('video','default',4,11,'10'),
('video','default',4,12,'K'),('video','default',4,13,'ficha'),('video','default',4,14,'esmeralda'),
('video','default',4,15,'J'),('video','default',4,16,'scatter'),('video','default',4,17,'A'),
('video','default',4,18,'Q'),('video','default',4,19,'rubi'),('video','default',4,20,'10'),
('video','default',4,21,'K'),('video','default',4,22,'dados'),('video','default',4,23,'J'),
('video','default',4,24,'A'),('video','default',4,25,'wild'),('video','default',4,26,'Q'),
('video','default',4,27,'esmeralda'),('video','default',4,28,'10'),('video','default',4,29,'rubi'),
('video','default',4,30,'K'),('video','default',4,31,'calice'),('video','default',4,32,'J'),
('video','default',4,33,'A'),('video','default',4,34,'Q'),('video','default',4,35,'ficha'),
('video','default',4,36,'10'),('video','default',4,37,'K'),('video','default',4,38,'rubi'),
('video','default',4,39,'esmeralda'),('video','default',4,40,'scatter'),('video','default',4,41,'J'),
('video','default',4,42,'A'),('video','default',4,43,'Q'),('video','default',4,44,'dados'),
('video','default',4,45,'10'),('video','default',4,46,'K'),('video','default',4,47,'rubi'),
('video','default',4,48,'calice'),('video','default',4,49,'J'),('video','default',4,50,'esmeralda'),
('video','default',4,51,'A'),('video','default',4,52,'Q'),('video','default',4,53,'wild'),
('video','default',4,54,'10'),('video','default',4,55,'ficha'),('video','default',4,56,'K'),
('video','default',4,57,'rubi'),('video','default',4,58,'J'),('video','default',4,59,'A'),
('video','default',4,60,'scatter'),('video','default',4,61,'Q'),('video','default',4,62,'esmeralda'),
('video','default',4,63,'dados'),('video','default',4,64,'10'),('video','default',4,65,'K'),
('video','default',4,66,'rubi'),('video','default',4,67,'calice'),('video','default',4,68,'J'),
('video','default',4,69,'wild'),('video','default',4,70,'A'),('video','default',4,71,'ficha'),
('video','default',4,72,'Q'),('video','default',4,73,'10'),('video','default',4,74,'esmeralda'),
('video','default',4,75,'K'),('video','default',4,76,'rubi'),('video','default',4,77,'scatter'),
('video','default',4,78,'J'),('video','default',4,79,'A'),('video','default',4,80,'dados'),
('video','default',4,81,'Q'),('video','default',4,82,'calice'),('video','default',4,83,'10'),
('video','default',4,84,'K'),('video','default',4,85,'esmeralda'),('video','default',4,86,'ficha'),
('video','default',4,87,'J'),('video','default',4,88,'rubi'),('video','default',4,89,'A'),
('video','default',4,90,'Q'),('video','default',4,91,'10'),('video','default',4,92,'K'),
('video','default',4,93,'J'),('video','default',4,94,'esmeralda'),('video','default',4,95,'rubi');

-- REEL 5 (Video)
INSERT INTO casino_slots_reel_strips (mode, rtp_profile, reel_index, position, symbol) VALUES
('video','default',5, 0,'K'),('video','default',5, 1,'10'),('video','default',5, 2,'J'),
('video','default',5, 3,'rubi'),('video','default',5, 4,'A'),('video','default',5, 5,'Q'),
('video','default',5, 6,'calice'),('video','default',5, 7,'esmeralda'),('video','default',5, 8,'K'),
('video','default',5, 9,'10'),('video','default',5,10,'ficha'),('video','default',5,11,'J'),
('video','default',5,12,'A'),('video','default',5,13,'Q'),('video','default',5,14,'rubi'),
('video','default',5,15,'scatter'),('video','default',5,16,'K'),('video','default',5,17,'10'),
('video','default',5,18,'esmeralda'),('video','default',5,19,'J'),('video','default',5,20,'dados'),
('video','default',5,21,'A'),('video','default',5,22,'Q'),('video','default',5,23,'rubi'),
('video','default',5,24,'wild'),('video','default',5,25,'K'),('video','default',5,26,'10'),
('video','default',5,27,'J'),('video','default',5,28,'ficha'),('video','default',5,29,'A'),
('video','default',5,30,'calice'),('video','default',5,31,'Q'),('video','default',5,32,'esmeralda'),
('video','default',5,33,'rubi'),('video','default',5,34,'K'),('video','default',5,35,'10'),
('video','default',5,36,'J'),('video','default',5,37,'scatter'),('video','default',5,38,'A'),
('video','default',5,39,'Q'),('video','default',5,40,'dados'),('video','default',5,41,'rubi'),
('video','default',5,42,'esmeralda'),('video','default',5,43,'K'),('video','default',5,44,'10'),
('video','default',5,45,'wild'),('video','default',5,46,'J'),('video','default',5,47,'calice'),
('video','default',5,48,'A'),('video','default',5,49,'ficha'),('video','default',5,50,'Q'),
('video','default',5,51,'rubi'),('video','default',5,52,'K'),('video','default',5,53,'10'),
('video','default',5,54,'esmeralda'),('video','default',5,55,'J'),('video','default',5,56,'A'),
('video','default',5,57,'scatter'),('video','default',5,58,'Q'),('video','default',5,59,'dados'),
('video','default',5,60,'rubi'),('video','default',5,61,'K'),('video','default',5,62,'10'),
('video','default',5,63,'calice'),('video','default',5,64,'J'),('video','default',5,65,'esmeralda'),
('video','default',5,66,'ficha'),('video','default',5,67,'A'),('video','default',5,68,'wild'),
('video','default',5,69,'Q'),('video','default',5,70,'rubi'),('video','default',5,71,'K'),
('video','default',5,72,'10'),('video','default',5,73,'J'),('video','default',5,74,'scatter'),
('video','default',5,75,'A'),('video','default',5,76,'esmeralda'),('video','default',5,77,'Q'),
('video','default',5,78,'calice'),('video','default',5,79,'dados'),('video','default',5,80,'rubi'),
('video','default',5,81,'ficha'),('video','default',5,82,'K'),('video','default',5,83,'10'),
('video','default',5,84,'J'),('video','default',5,85,'A'),('video','default',5,86,'Q'),
('video','default',5,87,'esmeralda'),('video','default',5,88,'rubi'),('video','default',5,89,'K'),
('video','default',5,90,'10'),('video','default',5,91,'J'),('video','default',5,92,'A'),
('video','default',5,93,'Q'),('video','default',5,94,'calice'),('video','default',5,95,'esmeralda');

-- ──────────────────────────────────────────────────────
-- 6. JACKPOT POOLS INICIAIS
-- ──────────────────────────────────────────────────────
INSERT INTO casino_slots_jackpot_pool (tier, mode, current_amount, seed_amount, contribution_rate, trigger_odds) VALUES
  ('mini',  'classic', 100.00,    100.00,   0.005000,    5000),
  ('grand', 'classic', 5000.00,   5000.00,  0.001000,  500000),
  ('mini',  'video',   100.00,    100.00,   0.005000,    5000),
  ('minor', 'video',   500.00,    500.00,   0.003000,   20000),
  ('major', 'video',   5000.00,   5000.00,  0.001500,  100000),
  ('grand', 'video',   50000.00,  50000.00, 0.000500, 1000000);

-- ──────────────────────────────────────────────────────
-- 7. ROUNDS MOCK (histórico de exemplo)
-- ──────────────────────────────────────────────────────
INSERT INTO casino_slots_rounds (user_id, mode, bet_amount, total_win, profit, reel_positions, symbols_result, wins_detail, tumble_count, final_multiplier, server_seed_hash, client_seed, nonce, rtp_profile, created_at) VALUES
  (1, 'video', 100.00, 450.00, 350.00,
   '[12,45,78,33,91,20]',
   '[["calice","K","10","rubi","A"],["dados","calice","Q","esmeralda","J"],["wild","J","esmeralda","K","10"],["calice","rubi","10","Q","A"],["A","K","calice","J","Q"],["ficha","10","rubi","A","K"]]',
   '[{"type":"cluster","symbol":"calice","count":6,"payout":200}]',
   2, 3.00, 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4', 'default', 1, 'default', '2026-03-04 10:15:00'),

  (2, 'video', 50.00, 0.00, -50.00,
   '[8,22,67,11,44,55]',
   '[["10","J","Q","K","A"],["K","A","10","J","Q"],["rubi","J","Q","esmeralda","K"],["esmeralda","10","K","A","J"],["A","J","10","Q","K"],["Q","K","J","10","A"]]',
   '[]',
   0, 1.00, 'f6e5d4c3b2a1f6e5d4c3b2a1f6e5d4c3b2a1f6e5d4c3b2a1f6e5d4c3', 'default', 1, 'default', '2026-03-04 10:16:30'),

  (3, 'classic', 20.00, 2000.00, 1980.00,
   '[5,18,42]',
   '[["777","777","777"]]',
   '[{"type":"payline","line":1,"symbol":"777","count":3,"payout":2000}]',
   0, 1.00, 'deadbeef1234deadbeef1234deadbeef1234deadbeef1234deadbeef12', 'default', 1, 'default', '2026-03-04 10:20:00'),

  (1, 'video', 200.00, 0.00, -200.00,
   '[55,3,89,70,16,42]',
   '[["J","A","rubi","Q","10"],["Q","dados","10","K","J"],["K","ficha","J","A","Q"],["10","Q","A","esmeralda","K"],["esmeralda","10","K","J","A"],["A","K","J","Q","10"]]',
   '[]',
   0, 1.00, '1234abcd56781234abcd56781234abcd56781234abcd56781234abcd56', 'default', 2, 'default', '2026-03-04 10:25:00'),

  (4, 'video', 500.00, 12500.00, 12000.00,
   '[2,41,76,30,88,15]',
   '[["scatter","calice","dados","esmeralda","rubi"],["scatter","wild","ficha","K","A"],["scatter","rubi","A","J","Q"],["calice","dados","K","10","esmeralda"],["wild","ficha","Q","A","J"],["rubi","A","K","Q","10"]]',
   '[{"type":"scatter","count":3,"freeSpins":10}]',
   5, 8.00, 'cafe1234babecafe1234babecafe1234babecafe1234babecafe1234ba', 'default', 1, 'default', '2026-03-04 10:30:00');

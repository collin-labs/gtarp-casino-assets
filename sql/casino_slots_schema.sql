-- ═══════════════════════════════════════════════════════════════
-- BLACKOUT CASINO — SLOTS ENGINE — Schema SQL
-- Fase 1: Todas as tabelas necessárias para o jogo Slots
-- Executar no banco: kushstore (MariaDB)
-- Data: 04/03/2026
-- ═══════════════════════════════════════════════════════════════

-- ──────────────────────────────────────────────────────
-- 1. CONFIG — Uma row por modo (classic, video)
-- ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS casino_slots_config (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mode ENUM('classic', 'video') NOT NULL,
  min_bet DECIMAL(15,2) NOT NULL DEFAULT 10.00,
  max_bet DECIMAL(15,2) NOT NULL DEFAULT 5000.00,
  rtp_profile VARCHAR(30) NOT NULL DEFAULT 'default',
  free_spins_cost_multiplier INT NOT NULL DEFAULT 25,
  turbo_enabled TINYINT(1) NOT NULL DEFAULT 1,
  autoplay_enabled TINYINT(1) NOT NULL DEFAULT 1,
  autoplay_max_spins INT NOT NULL DEFAULT 100,
  jackpot_enabled TINYINT(1) NOT NULL DEFAULT 1,
  max_tumbles INT NOT NULL DEFAULT 50,
  rate_limit_ms INT NOT NULL DEFAULT 1500,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_mode (mode)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ──────────────────────────────────────────────────────
-- 2. REEL STRIPS — Strip completa de cada reel
--    Classic: 3 reels × 64 stops = 192 rows por profile
--    Video:   6 reels × 96 stops = 576 rows por profile
-- ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS casino_slots_reel_strips (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mode ENUM('classic', 'video') NOT NULL,
  rtp_profile VARCHAR(30) NOT NULL DEFAULT 'default',
  reel_index TINYINT NOT NULL,
  position SMALLINT NOT NULL,
  symbol VARCHAR(30) NOT NULL,
  INDEX idx_mode_profile_reel (mode, rtp_profile, reel_index),
  INDEX idx_lookup (mode, rtp_profile, reel_index, position)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ──────────────────────────────────────────────────────
-- 3. PAYTABLE — Pagamentos por símbolo e contagem
--    Classic: count = 3 (3 iguais na payline)
--    Video:   count = 5, 8, 12, 15, 20 (cluster sizes)
-- ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS casino_slots_paytable (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mode ENUM('classic', 'video') NOT NULL,
  symbol VARCHAR(30) NOT NULL,
  count TINYINT NOT NULL,
  payout_multiplier DECIMAL(10,2) NOT NULL,
  symbol_type ENUM('wild', 'scatter', 'premium', 'mid', 'low', 'blank') NOT NULL,
  display_order TINYINT NOT NULL DEFAULT 0,
  INDEX idx_mode_symbol (mode, symbol),
  INDEX idx_mode_symbol_count (mode, symbol, count)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ──────────────────────────────────────────────────────
-- 4. ROUNDS — Cada spin registrado (audit trail)
-- ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS casino_slots_rounds (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  mode ENUM('classic', 'video') NOT NULL,
  bet_amount DECIMAL(15,2) NOT NULL,
  total_win DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  profit DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  reel_positions JSON NOT NULL,
  symbols_result JSON NOT NULL,
  wins_detail JSON NOT NULL DEFAULT ('[]'),
  tumble_count TINYINT NOT NULL DEFAULT 0,
  final_multiplier DECIMAL(6,2) NOT NULL DEFAULT 1.00,
  is_free_spin TINYINT(1) NOT NULL DEFAULT 0,
  free_spin_session_id BIGINT DEFAULT NULL,
  jackpot_tier VARCHAR(10) DEFAULT NULL,
  jackpot_amount DECIMAL(15,2) DEFAULT NULL,
  server_seed_hash VARCHAR(64) NOT NULL,
  client_seed VARCHAR(64) NOT NULL DEFAULT 'default',
  nonce INT NOT NULL DEFAULT 0,
  cursor_start INT NOT NULL DEFAULT 0,
  rtp_profile VARCHAR(30) NOT NULL DEFAULT 'default',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user (user_id),
  INDEX idx_user_mode (user_id, mode),
  INDEX idx_created (created_at),
  INDEX idx_free_session (free_spin_session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ──────────────────────────────────────────────────────
-- 5. FREE SPINS SESSIONS — Sessões de free spins
-- ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS casino_slots_free_spins (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  mode ENUM('classic', 'video') NOT NULL DEFAULT 'video',
  trigger_type ENUM('scatter', 'bonus_buy', 'retrigger') NOT NULL,
  total_spins TINYINT NOT NULL DEFAULT 10,
  spins_remaining TINYINT NOT NULL DEFAULT 10,
  accumulated_multiplier DECIMAL(6,2) NOT NULL DEFAULT 1.00,
  total_win DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  bet_amount DECIMAL(15,2) NOT NULL,
  retrigger_count TINYINT NOT NULL DEFAULT 0,
  status ENUM('active', 'completed', 'cancelled') NOT NULL DEFAULT 'active',
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL DEFAULT NULL,
  INDEX idx_user_status (user_id, status),
  INDEX idx_user_active (user_id, mode, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ──────────────────────────────────────────────────────
-- 6. JACKPOT POOL — Pools progressivos por tier/modo
-- ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS casino_slots_jackpot_pool (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tier ENUM('mini', 'minor', 'major', 'grand') NOT NULL,
  mode ENUM('classic', 'video', 'global') NOT NULL,
  current_amount DECIMAL(15,2) NOT NULL,
  seed_amount DECIMAL(15,2) NOT NULL,
  contribution_rate DECIMAL(8,6) NOT NULL,
  trigger_odds INT NOT NULL,
  last_hit_user_id INT DEFAULT NULL,
  last_hit_amount DECIMAL(15,2) DEFAULT NULL,
  last_hit_at TIMESTAMP NULL DEFAULT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_tier_mode (tier, mode)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ──────────────────────────────────────────────────────
-- 7. AUDIT LOG — Registro de todas as ações admin+jogo
-- ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS casino_slots_audit_log (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id INT DEFAULT NULL,
  action VARCHAR(50) NOT NULL,
  details JSON NOT NULL,
  ip_address VARCHAR(45) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_action (action),
  INDEX idx_user (user_id),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ──────────────────────────────────────────────────────
-- 8. SERVER SEEDS — Seeds por sessão de usuário
-- ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS casino_slots_server_seeds (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  server_seed VARCHAR(64) NOT NULL,
  server_seed_hash VARCHAR(64) NOT NULL,
  client_seed VARCHAR(64) NOT NULL DEFAULT 'default',
  nonce INT NOT NULL DEFAULT 0,
  status ENUM('active', 'revealed', 'rotated') NOT NULL DEFAULT 'active',
  revealed_at TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_active (user_id, status),
  UNIQUE KEY uk_user_active (user_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

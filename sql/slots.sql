-- Blackout Casino — Slot Machine Schema
-- Compativel com MariaDB 10.6+ e MySQL 8.0+
-- Usar com oxmysql (prepared statements, ? placeholders)
-- Depende de: casino_accounts (panel.sql)

-- Sessoes de jogo (1 sessao = 1 periodo de jogo com mesmo server seed)
CREATE TABLE IF NOT EXISTS casino_slot_sessions (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  identifier      VARCHAR(60)  NOT NULL,
  mode            ENUM('video','classic') NOT NULL DEFAULT 'video',
  server_seed     VARCHAR(64)  NOT NULL,
  server_seed_hash VARCHAR(64) NOT NULL,
  client_seed     VARCHAR(32)  NOT NULL,
  nonce_start     INT UNSIGNED NOT NULL DEFAULT 0,
  nonce_end       INT UNSIGNED DEFAULT NULL,
  total_bet       DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  total_won       DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  spins_count     INT UNSIGNED NOT NULL DEFAULT 0,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  closed_at       TIMESTAMP DEFAULT NULL,
  INDEX idx_identifier (identifier),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Cada spin individual (auditoria completa)
CREATE TABLE IF NOT EXISTS casino_slot_spins (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  session_id      BIGINT UNSIGNED NOT NULL,
  identifier      VARCHAR(60)  NOT NULL,
  mode            ENUM('video','classic') NOT NULL,
  nonce           INT UNSIGNED NOT NULL,
  bet             DECIMAL(12,2) NOT NULL,
  ante_bet        TINYINT(1) NOT NULL DEFAULT 0,
  total_bet       DECIMAL(12,2) NOT NULL,
  win             DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  multiplier      DECIMAL(8,2) NOT NULL DEFAULT 1.00,
  tumbles         INT UNSIGNED NOT NULL DEFAULT 0,
  scatter_count   INT UNSIGNED NOT NULL DEFAULT 0,
  free_spins_triggered TINYINT(1) NOT NULL DEFAULT 0,
  is_buy_bonus    TINYINT(1) NOT NULL DEFAULT 0,
  is_jackpot      TINYINT(1) NOT NULL DEFAULT 0,
  jackpot_win     DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  saldo_antes     DECIMAL(14,2) NOT NULL,
  saldo_depois    DECIMAL(14,2) NOT NULL,
  grid_hash       VARCHAR(64)  DEFAULT NULL,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_session (session_id),
  INDEX idx_identifier_data (identifier, created_at),
  INDEX idx_mode (mode),
  CONSTRAINT fk_spin_session FOREIGN KEY (session_id) REFERENCES casino_slot_sessions(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Jackpot progressivo do slot machine
CREATE TABLE IF NOT EXISTS casino_slot_jackpot (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  pool            DECIMAL(14,2) NOT NULL DEFAULT 10000.00,
  last_winner     VARCHAR(60)  DEFAULT NULL,
  last_win_amount DECIMAL(14,2) DEFAULT NULL,
  last_win_at     TIMESTAMP DEFAULT NULL,
  total_contributed DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  total_paid      DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed inicial do jackpot
INSERT INTO casino_slot_jackpot (pool) VALUES (10000.00)
ON DUPLICATE KEY UPDATE id = id;

-- Config especifica do slot (complementa casino_config do panel.sql)
INSERT INTO casino_config (chave, valor, descricao) VALUES
  ('slot_rtp_target',           '96.50',  'RTP alvo do slot machine (%)'),
  ('slot_volatility',           'high',   'Volatilidade: low/medium/high'),
  ('slot_min_bet',              '1',      'Aposta minima GCoin'),
  ('slot_max_bet',              '500',    'Aposta maxima GCoin'),
  ('slot_buy_bonus_mult',       '100',    'Multiplicador buy bonus (bet * N)'),
  ('slot_ante_bet_mod',         '1.25',   'Modificador ante bet (bet * N)'),
  ('slot_fs_count',             '10',     'Free spins por trigger'),
  ('slot_fs_scatter_req',       '4',      'Scatters para trigger FS'),
  ('slot_jackpot_contrib',      '1.5',    'Contribuicao jackpot por spin (%)'),
  ('slot_max_win_mult',         '5000',   'Multiplicador maximo de win'),
  ('slot_cooldown_ms',          '1000',   'Cooldown entre spins (ms) anti-exploit'),
  ('slot_max_spins_per_min',    '30',     'Max spins por minuto anti-bot'),
  ('slot_enabled',              '1',      'Slot machine habilitado (1/0)')
ON DUPLICATE KEY UPDATE chave = chave;

-- View para relatorio admin (ultimos 100 spins)
CREATE OR REPLACE VIEW v_slot_recent_spins AS
SELECT
  s.id,
  s.identifier,
  s.mode,
  s.bet,
  s.total_bet,
  s.win,
  s.multiplier,
  s.tumbles,
  s.free_spins_triggered,
  s.is_buy_bonus,
  s.is_jackpot,
  s.saldo_antes,
  s.saldo_depois,
  s.created_at
FROM casino_slot_spins s
ORDER BY s.created_at DESC
LIMIT 100;

-- View para stats por jogador
CREATE OR REPLACE VIEW v_slot_player_stats AS
SELECT
  identifier,
  COUNT(*) as total_spins,
  SUM(total_bet) as total_wagered,
  SUM(win) as total_won,
  ROUND(SUM(win) / NULLIF(SUM(total_bet), 0) * 100, 2) as rtp_real,
  MAX(win) as biggest_win,
  MAX(multiplier) as biggest_multiplier,
  SUM(CASE WHEN is_jackpot = 1 THEN 1 ELSE 0 END) as jackpots_won,
  SUM(CASE WHEN free_spins_triggered = 1 THEN 1 ELSE 0 END) as fs_triggered,
  MIN(created_at) as first_spin,
  MAX(created_at) as last_spin
FROM casino_slot_spins
GROUP BY identifier;

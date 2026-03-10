-- =====================================================
-- BLACKOUT CASINO -- CASES -- Schema
-- Banco: brasil (MariaDB no servidor GTARP)
-- Executar: Get-Content sql\casino_cases_schema.sql | mysql -u root -p -h 10.8.0.1 -P 3310 brasil
-- =====================================================

-- Tabela 1: Caixas disponiveis
CREATE TABLE IF NOT EXISTS casino_cases (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) NOT NULL UNIQUE,
  description TEXT DEFAULT NULL,
  price DECIMAL(15,2) NOT NULL,
  image_url VARCHAR(255) DEFAULT NULL,
  theme_color VARCHAR(7) DEFAULT '#D4A843',
  category ENUM('standard','premium','budget','event','daily_free') DEFAULT 'standard',
  is_active TINYINT(1) DEFAULT 1,
  max_opens_per_day INT DEFAULT 0,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_active_sort (is_active, sort_order),
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela 2: Itens dentro de cada caixa
CREATE TABLE IF NOT EXISTS casino_case_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  case_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(255) DEFAULT NULL,
  image_url VARCHAR(255) DEFAULT NULL,
  rarity ENUM('common','uncommon','rare','epic','legendary') NOT NULL,
  rarity_color VARCHAR(7) NOT NULL,
  value DECIMAL(15,2) NOT NULL,
  sell_back_value DECIMAL(15,2) DEFAULT 0,
  probability DECIMAL(6,3) NOT NULL,
  item_type ENUM('weapon','vehicle','clothing','money','vip','cosmetic','special') DEFAULT 'cosmetic',
  game_item_id VARCHAR(100) DEFAULT NULL,
  is_active TINYINT(1) DEFAULT 1,
  sort_order INT DEFAULT 0,
  INDEX idx_case (case_id),
  INDEX idx_rarity (rarity),
  CONSTRAINT fk_case_items_case FOREIGN KEY (case_id) REFERENCES casino_cases(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela 3: Registro de aberturas (historico + provably fair)
CREATE TABLE IF NOT EXISTS casino_cases_openings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  case_id INT NOT NULL,
  item_id INT NOT NULL,
  price_paid DECIMAL(15,2) NOT NULL,
  item_value DECIMAL(15,2) NOT NULL,
  profit DECIMAL(15,2) GENERATED ALWAYS AS (item_value - price_paid) STORED,
  hash VARCHAR(64) NOT NULL,
  seed_nonce BIGINT NOT NULL,
  is_free TINYINT(1) DEFAULT 0,
  action ENUM('kept','sold','pending') DEFAULT 'pending',
  sold_at TIMESTAMP DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user (user_id),
  INDEX idx_case (case_id),
  INDEX idx_created (created_at DESC),
  INDEX idx_user_case_date (user_id, case_id, created_at),
  CONSTRAINT fk_openings_case FOREIGN KEY (case_id) REFERENCES casino_cases(id),
  CONSTRAINT fk_openings_item FOREIGN KEY (item_id) REFERENCES casino_case_items(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela 4: Inventario de itens ganhos
CREATE TABLE IF NOT EXISTS casino_cases_inventory (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  opening_id INT NOT NULL,
  item_id INT NOT NULL,
  status ENUM('owned','sold','equipped','traded') DEFAULT 'owned',
  acquired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  sold_at TIMESTAMP DEFAULT NULL,
  INDEX idx_user_status (user_id, status),
  CONSTRAINT fk_inv_opening FOREIGN KEY (opening_id) REFERENCES casino_cases_openings(id),
  CONSTRAINT fk_inv_item FOREIGN KEY (item_id) REFERENCES casino_case_items(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela 5: Audit log (REGRA 12)
CREATE TABLE IF NOT EXISTS casino_cases_audit (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  action VARCHAR(50) NOT NULL,
  details JSON DEFAULT NULL,
  ip_address VARCHAR(45) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_action (user_id, action),
  INDEX idx_created (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela 6: Case Battles PvP (incluido desde o inicio)
CREATE TABLE IF NOT EXISTS casino_cases_battles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  creator_id INT NOT NULL,
  status ENUM('waiting','in_progress','finished','cancelled') DEFAULT 'waiting',
  max_players TINYINT DEFAULT 2,
  case_sequence JSON NOT NULL,
  entry_fee DECIMAL(15,2) NOT NULL,
  total_pot DECIMAL(15,2) DEFAULT 0,
  winner_id INT DEFAULT NULL,
  house_fee_pct DECIMAL(4,2) DEFAULT 5.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  finished_at TIMESTAMP DEFAULT NULL,
  INDEX idx_status (status),
  INDEX idx_creator (creator_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela 7: Jogadores em cada battle
CREATE TABLE IF NOT EXISTS casino_cases_battle_players (
  id INT AUTO_INCREMENT PRIMARY KEY,
  battle_id INT NOT NULL,
  user_id INT NOT NULL,
  total_value DECIMAL(15,2) DEFAULT 0,
  items_won JSON DEFAULT NULL,
  rank TINYINT DEFAULT 0,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_battle (battle_id),
  INDEX idx_user (user_id),
  UNIQUE KEY uq_battle_user (battle_id, user_id),
  CONSTRAINT fk_bp_battle FOREIGN KEY (battle_id) REFERENCES casino_cases_battles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Blackout Casino - Jogo do Bicho (#9) - Schema MySQL
-- Compativel com MariaDB 10.3+ e MySQL 5.7+
-- Usar com oxmysql (prepared statements)
-- Executar APOS panel.sql (depende de casino_accounts)

-- Config especifica do Jogo do Bicho (admin ajusta sem restart)
CREATE TABLE IF NOT EXISTS casino_bicho_config (
    id INT PRIMARY KEY DEFAULT 1,
    bet_min INT NOT NULL DEFAULT 50,
    bet_max_simple INT NOT NULL DEFAULT 5000,
    bet_max_dupla INT NOT NULL DEFAULT 2000,
    bet_max_tripla INT NOT NULL DEFAULT 1000,
    bet_max_quadra INT NOT NULL DEFAULT 500,
    bet_max_quina INT NOT NULL DEFAULT 200,
    mult_simple_first INT NOT NULL DEFAULT 12,
    mult_simple_other INT NOT NULL DEFAULT 3,
    mult_dupla_first INT NOT NULL DEFAULT 90,
    mult_dupla_other INT NOT NULL DEFAULT 10,
    mult_tripla_first INT NOT NULL DEFAULT 650,
    mult_tripla_other INT NOT NULL DEFAULT 40,
    mult_quadra_first INT NOT NULL DEFAULT 3500,
    mult_quadra_other INT NOT NULL DEFAULT 180,
    mult_quina_first INT NOT NULL DEFAULT 15000,
    mult_quina_other INT NOT NULL DEFAULT 1200,
    cooldown_ms INT NOT NULL DEFAULT 3000,
    max_rounds_per_hour INT NOT NULL DEFAULT 60,
    max_payout INT NOT NULL DEFAULT 3000000,
    enabled TINYINT(1) NOT NULL DEFAULT 1,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO casino_bicho_config (id) VALUES (1);


-- Rodadas/sorteios do Jogo do Bicho
CREATE TABLE IF NOT EXISTS casino_bicho_rounds (
    id INT AUTO_INCREMENT PRIMARY KEY,
    identifier VARCHAR(64) NOT NULL,
    mode VARCHAR(16) NOT NULL,
    animals_selected JSON DEFAULT NULL,
    bet_amount INT NOT NULL,
    server_seed VARCHAR(64) NOT NULL,
    server_seed_hash VARCHAR(64) NOT NULL,
    client_seed VARCHAR(64) NOT NULL,
    nonce INT NOT NULL DEFAULT 0,
    result_hash VARCHAR(64) NOT NULL,
    prize_1_milhar VARCHAR(4) NOT NULL,
    prize_1_grupo INT NOT NULL,
    prize_2_milhar VARCHAR(4) NOT NULL,
    prize_2_grupo INT NOT NULL,
    prize_3_milhar VARCHAR(4) NOT NULL,
    prize_3_grupo INT NOT NULL,
    prize_4_milhar VARCHAR(4) NOT NULL,
    prize_4_grupo INT NOT NULL,
    prize_5_milhar VARCHAR(4) NOT NULL,
    prize_5_grupo INT NOT NULL,
    won TINYINT(1) NOT NULL DEFAULT 0,
    payout_amount INT NOT NULL DEFAULT 0,
    payout_multiplier DECIMAL(8,2) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_identifier (identifier),
    INDEX idx_created (created_at),
    INDEX idx_won (won)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Audit log do Jogo do Bicho
CREATE TABLE IF NOT EXISTS casino_bicho_audit (
    id INT AUTO_INCREMENT PRIMARY KEY,
    identifier VARCHAR(64) DEFAULT NULL,
    action VARCHAR(32) NOT NULL,
    round_id INT DEFAULT NULL,
    details JSON DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_identifier_action (identifier, action),
    INDEX idx_round (round_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Queries admin uteis (NAO executar, somente referencia)
-- Total rodadas: SELECT COUNT(*) FROM casino_bicho_rounds;
-- Lucro casa: SELECT SUM(bet_amount) - SUM(payout_amount) FROM casino_bicho_rounds;
-- Top wins: SELECT * FROM casino_bicho_rounds WHERE won=1 ORDER BY payout_amount DESC LIMIT 10;
-- Stats por animal: SELECT prize_1_grupo, COUNT(*) FROM casino_bicho_rounds GROUP BY prize_1_grupo;

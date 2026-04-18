-- Blackout Casino — Admin Auth
-- Tabela de autenticacao do painel administrativo
-- Executar APOS panel.sql
-- Unica row (id=1) — nao permite multiplos admins

CREATE TABLE IF NOT EXISTS casino_admin_auth (
  id              INT PRIMARY KEY DEFAULT 1,
  master_password VARCHAR(64) DEFAULT NULL,
  admin_password  VARCHAR(64) DEFAULT NULL,
  setup_complete  TINYINT(1)  NOT NULL DEFAULT 0,
  last_login_at   TIMESTAMP   DEFAULT NULL,
  last_login_ip   VARCHAR(45) DEFAULT NULL,
  failed_attempts INT         NOT NULL DEFAULT 0,
  locked_until    TIMESTAMP   DEFAULT NULL,
  created_at      TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed: senha mestre "blackout-casino-master-2026"
-- SHA256: echo -n "blackout-casino-master-2026" | sha256sum
INSERT INTO casino_admin_auth (id, master_password, setup_complete) VALUES
  (1, SHA2('blackout-casino-master-2026', 256), 0)
ON DUPLICATE KEY UPDATE id = id;

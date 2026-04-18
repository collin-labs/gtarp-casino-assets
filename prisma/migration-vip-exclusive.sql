-- ============================================
-- HUNT STORE — MIGRATION: CAMPOS EXCLUSIVOS VIP
-- Separar dados do tier vs dados exclusivos por duracao
-- Executar em HeidiSQL (local + servidor)
-- ============================================

-- Beneficios exclusivos da duracao (nunca propagam pro tier)
ALTER TABLE vip_plans
  ADD COLUMN exclusiveBenefits LONGTEXT DEFAULT NULL
  AFTER benefits;

-- Comandos exclusivos da duracao (nunca propagam pro tier)
ALTER TABLE vip_plans
  ADD COLUMN exclusiveCommands LONGTEXT DEFAULT NULL
  AFTER commands;

-- Imagem exclusiva da duracao (nunca propaga pro tier)
ALTER TABLE vip_plans
  ADD COLUMN exclusiveImage TEXT DEFAULT NULL
  AFTER image;

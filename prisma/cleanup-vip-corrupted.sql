-- ============================================
-- HUNT STORE — LIMPEZA DADOS CORROMPIDOS VIP
-- O merge antigo contaminou o campo benefits com dados de teste
-- Rodar no HeidiSQL ANTES de re-salvar os tiers no admin
-- ============================================

-- PASSO 1: DIAGNOSTICO — ver o que tem em cada plano
SELECT id, tier, duration, name,
  LEFT(benefits, 200) AS benefits_preview,
  LEFT(exclusiveBenefits, 200) AS exclusive_preview,
  LEFT(commands, 200) AS commands_preview
FROM vip_plans
WHERE deletedAt IS NULL
ORDER BY tier, duration;

-- PASSO 2: LIMPAR benefits corrompidos
-- Reseta benefits pra "[]" em TODOS os planos ativos
-- Depois BC re-salva cada tier no admin e o autoBenefits regenera corretamente
UPDATE vip_plans
SET benefits = '[]'
WHERE deletedAt IS NULL;

-- PASSO 3: LIMPAR duplicatas de duracao (ex: 2x "30d" no DIAMANTE)
-- Primeiro ver quais tem duplicata:
SELECT tier, duration, COUNT(*) AS total
FROM vip_plans
WHERE deletedAt IS NULL
GROUP BY tier, duration
HAVING COUNT(*) > 1;

-- Para cada duplicata, soft-delete o mais antigo (manter o mais recente):
-- EXEMPLO (ajustar IDs conforme resultado acima):
-- UPDATE vip_plans SET deletedAt = NOW(), isActive = 0
-- WHERE id = 'ID_DO_DUPLICADO_MAIS_ANTIGO';

-- PASSO 4: VERIFICAR — rodar o SELECT do passo 1 de novo
-- Todos os benefits devem estar "[]"
-- Depois ir no Admin > VIP > Editar cada tier > Salvar
-- Isso regenera os benefits a partir da tabela comparativa

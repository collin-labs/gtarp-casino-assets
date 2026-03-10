-- ═══════════════════════════════════════════════════
-- BLACKOUT CASINO — CASES — UPDATE image_url
-- Executar: Get-Content sql\casino_cases_update_images.sql | mysql -u root -p -h 10.8.0.1 -P 3310 brasil
-- ═══════════════════════════════════════════════════

-- 6 Caixas: image_url = imagem FECHADA (usada no catálogo)
UPDATE casino_cases SET image_url = '/assets/cases/caixas/1-Caixa-Arsenal-Dourado-FECHADA.png' WHERE id = 1;
UPDATE casino_cases SET image_url = '/assets/cases/caixas/2-Caixa-Garagem-VIP-FECHADA.png' WHERE id = 2;
UPDATE casino_cases SET image_url = '/assets/cases/caixas/3-Caixa-Pacote-Urbano-FECHADA.png' WHERE id = 3;
UPDATE casino_cases SET image_url = '/assets/cases/caixas/4-Caixa-Cofre-Secreto-FECHADA.png' WHERE id = 4;
UPDATE casino_cases SET image_url = '/assets/cases/caixas/5-Caixa-Noturna-FECHADA.png' WHERE id = 5;
UPDATE casino_cases SET image_url = '/assets/cases/caixas/6-Caixa-Diaria-FECHADA.png' WHERE id = 6;

-- Itens Arsenal Dourado (case_id = 1)
UPDATE casino_case_items SET image_url = '/assets/cases/itens/arsenal/1-Itens-Arsenal-Dourado-Pistola-Tatica.png' WHERE case_id = 1 AND sort_order = 1;
UPDATE casino_case_items SET image_url = '/assets/cases/itens/arsenal/2-Itens-Arsenal-Dourado-SMG-Compacta.png' WHERE case_id = 1 AND sort_order = 2;
UPDATE casino_case_items SET image_url = '/assets/cases/itens/arsenal/3-Itens-Arsenal-Dourado-Carabina-MK2.png' WHERE case_id = 1 AND sort_order = 3;
UPDATE casino_case_items SET image_url = '/assets/cases/itens/arsenal/4-Itens-Arsenal-Dourado-Shotgun-de-Combate.png' WHERE case_id = 1 AND sort_order = 4;
UPDATE casino_case_items SET image_url = '/assets/cases/itens/arsenal/5-Itens-Arsenal-Dourado-Sniper-Pesada.png' WHERE case_id = 1 AND sort_order = 5;
UPDATE casino_case_items SET image_url = '/assets/cases/itens/arsenal/6-Itens-Arsenal-Dourado-Minigun-Dourada.png' WHERE case_id = 1 AND sort_order = 6;
UPDATE casino_case_items SET image_url = '/assets/cases/itens/arsenal/7-Itens-Arsenal-Dourado-RPG-Edicao-Limitada.png' WHERE case_id = 1 AND sort_order = 7;
UPDATE casino_case_items SET image_url = '/assets/cases/itens/arsenal/8-Itens-Arsenal-Dourado-Railgun-Blackout-(LEGENDARY).png' WHERE case_id = 1 AND sort_order = 8;

-- Itens Garagem VIP (case_id = 2)
UPDATE casino_case_items SET image_url = '/assets/cases/itens/garagem/1-Itens-Garagem-VIP-Futo-GTX-(common).png' WHERE case_id = 2 AND sort_order = 1;
UPDATE casino_case_items SET image_url = '/assets/cases/itens/garagem/2-Itens-Garagem-VIP-Sultan-RS-(common).png' WHERE case_id = 2 AND sort_order = 2;
UPDATE casino_case_items SET image_url = '/assets/cases/itens/garagem/3-Itens-Garagem-VIP-Elegy-RH8-(uncommon).png' WHERE case_id = 2 AND sort_order = 3;
UPDATE casino_case_items SET image_url = '/assets/cases/itens/garagem/4-Itens-Garagem-VIP-Jester-Classic-(uncommon).png' WHERE case_id = 2 AND sort_order = 4;
UPDATE casino_case_items SET image_url = '/assets/cases/itens/garagem/5-Itens-Garagem-VIP-Itali-GTO-(rare).png' WHERE case_id = 2 AND sort_order = 5;
UPDATE casino_case_items SET image_url = '/assets/cases/itens/garagem/6-Itens-Garagem-VIP-21-Thrax-(rare).png' WHERE case_id = 2 AND sort_order = 6;
UPDATE casino_case_items SET image_url = '/assets/cases/itens/garagem/7-Itens-Garagem-VIP-Tezeract-(epic).png' WHERE case_id = 2 AND sort_order = 7;
UPDATE casino_case_items SET image_url = '/assets/cases/itens/garagem/8-Itens-Garagem-VIP-Scramjet-Dourado-(LEGENDARY).png' WHERE case_id = 2 AND sort_order = 8;

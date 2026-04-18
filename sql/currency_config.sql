-- Blackout Casino — Currency Config
-- Complementa casino_config (panel.sql)
-- Executar APOS panel.sql
-- Chaves existentes (gcoin_rate, min_deposit, etc) NAO sao duplicadas aqui

INSERT INTO casino_config (chave, valor, descricao) VALUES
  ('currency_name',           'GCoin',
   'Nome da moeda exibida no casino'),
  ('currency_symbol',         'GC',
   'Abreviacao da moeda (ex: GC, FC)'),
  ('currency_icon',           '/assets/shared/icons/icon-gcoin.png',
   'Caminho do icone da moeda'),
  ('currency_rate_label',     '1 GCoin = $1.05',
   'Texto descritivo da taxa de conversao'),
  ('deposit_fee_percent',     '0',
   'Taxa de deposito em percentual (0 = sem taxa)'),
  ('deposit_explanation_br',  'Converte dinheiro da sua carteira em fichas para jogar no casino. O valor e debitado instantaneamente.',
   'Texto de ajuda deposito PT-BR'),
  ('deposit_explanation_en',  'Converts money from your wallet into chips to play at the casino. The amount is debited instantly.',
   'Texto de ajuda deposito EN'),
  ('withdraw_explanation_br', 'Converte fichas do casino de volta para dinheiro na sua carteira. O valor e creditado instantaneamente.',
   'Texto de ajuda saque PT-BR'),
  ('withdraw_explanation_en', 'Converts casino chips back into money in your wallet. The amount is credited instantly.',
   'Texto de ajuda saque EN'),
  ('fee_explanation_br',      'Depositos nao possuem taxa. Saques possuem uma taxa de {withdraw_tax_percent}%.',
   'Texto sobre taxas PT-BR (placeholder {withdraw_tax_percent})'),
  ('fee_explanation_en',      'Deposits have no fee. Withdrawals have a {withdraw_tax_percent}% fee.',
   'Texto sobre taxas EN (placeholder {withdraw_tax_percent})'),
  ('help_title_br',           'Como funciona?',
   'Titulo do painel de ajuda PT-BR'),
  ('help_title_en',           'How does it work?',
   'Titulo do painel de ajuda EN')
ON DUPLICATE KEY UPDATE chave = chave;

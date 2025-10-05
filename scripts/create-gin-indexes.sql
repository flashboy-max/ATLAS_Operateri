-- filepath: scripts/create-gin-indexes.sql
-- GIN indeksi za brzu pretragu kroz JSONB polja
-- Pokreni NAKON Prisma migracije: psql -U atlas_user -d atlas_db -f scripts/create-gin-indexes.sql

\echo '🔍 Kreiranje GIN indeksa za JSONB polja...'

-- Operator - pretraga po uslugama (npr. "Koji operateri imaju 5G?")
CREATE INDEX IF NOT EXISTS idx_operator_services 
  ON operator USING GIN (services);
\echo '✅ idx_operator_services kreiran'

-- Operator - pretraga po tehnologijama
CREATE INDEX IF NOT EXISTS idx_operator_technologies 
  ON operator USING GIN (technologies);
\echo '✅ idx_operator_technologies kreiran'

-- Operator - pretraga po zakonskim obavezama (KRITIČNO za policiju)
CREATE INDEX IF NOT EXISTS idx_operator_legal_obligations 
  ON operator USING GIN (legal_obligations);
\echo '✅ idx_operator_legal_obligations kreiran'

-- Operator - pretraga po kontaktima
CREATE INDEX IF NOT EXISTS idx_operator_contact_info 
  ON operator USING GIN (contact_info);
\echo '✅ idx_operator_contact_info kreiran'

-- Audit log - pretraga kroz metadata (prije/poslije promjena, razlozi, itd.)
CREATE INDEX IF NOT EXISTS idx_audit_metadata 
  ON audit_log USING GIN (metadata);
\echo '✅ idx_audit_metadata kreiran'

\echo ''
\echo '🎉 Svi GIN indeksi su uspješno kreirani!'
\echo ''
\echo 'Testiranje indeksa:'
\echo '==================='
\echo ''
\echo '-- Pronađi operatere sa 5G'
\echo 'SELECT legal_name, commercial_name FROM operator'
\echo 'WHERE services @> ''{"mobilne": ["5g"]}''::jsonb;'
\echo ''
\echo '-- Pronađi operatere sa zakonitim presretanjem'
\echo 'SELECT legal_name FROM operator'
\echo 'WHERE legal_obligations @> ''{"zakonito_presretanje": "Da"}''::jsonb;'
\echo ''
\echo '-- Pronađi audit logove gdje je email promijenjen'
\echo 'SELECT * FROM audit_log'
\echo 'WHERE metadata @> ''{"changed_fields": ["email"]}''::jsonb;'

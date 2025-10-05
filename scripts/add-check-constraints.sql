-- filepath: scripts/add-check-constraints.sql
-- CHECK constraints za validaciju podataka na nivou baze
-- Pokreni NAKON Prisma migracije: psql -U atlas_user -d atlas_db -f scripts/add-check-constraints.sql

\echo '✅ Dodavanje CHECK constraints za validaciju...'

-- ==================== OPERATOR ====================

-- Operator status - samo dozvoljene vrijednosti
ALTER TABLE operator 
  ADD CONSTRAINT IF NOT EXISTS check_operator_status 
  CHECK (status IN ('aktivan', 'neaktivan', 'u pripremi', 'zatvoren'));
\echo '✅ check_operator_status dodat'

-- Legal name ne smije biti prazan
ALTER TABLE operator
  ADD CONSTRAINT IF NOT EXISTS check_operator_legal_name_not_empty
  CHECK (LENGTH(TRIM(legal_name)) > 0);
\echo '✅ check_operator_legal_name_not_empty dodat'

-- ==================== APP_USER ====================

-- Email format validacija (RFC 5322 simplified)
ALTER TABLE app_user 
  ADD CONSTRAINT IF NOT EXISTS check_user_email_format
  CHECK (
    email IS NULL OR 
    email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'
  );
\echo '✅ check_user_email_format dodat'

-- Username format (samo alfanumerik + underscore/dot/dash, 3-150 karaktera)
ALTER TABLE app_user 
  ADD CONSTRAINT IF NOT EXISTS check_user_username_format
  CHECK (username ~ '^[a-zA-Z0-9._-]{3,150}$');
\echo '✅ check_user_username_format dodat'

-- Password hash minimum length (bcrypt=60, argon2=97+)
ALTER TABLE app_user 
  ADD CONSTRAINT IF NOT EXISTS check_user_pass_hash_length
  CHECK (LENGTH(pass_hash) >= 60);
\echo '✅ check_user_pass_hash_length dodat'

-- Full name ne smije biti prazan ako je prisutan
ALTER TABLE app_user
  ADD CONSTRAINT IF NOT EXISTS check_user_full_name_not_empty
  CHECK (full_name IS NULL OR LENGTH(TRIM(full_name)) > 0);
\echo '✅ check_user_full_name_not_empty dodat'

-- MFA secret mora biti postavljen ako je MFA enabled
ALTER TABLE app_user
  ADD CONSTRAINT IF NOT EXISTS check_user_mfa_secret_required
  CHECK (
    (mfa_enabled = false AND mfa_secret IS NULL) OR
    (mfa_enabled = true AND mfa_secret IS NOT NULL)
  );
\echo '✅ check_user_mfa_secret_required dodat'

-- ==================== AUDIT_LOG ====================

-- Hash current format - SHA-256 = 64 hex karaktera
ALTER TABLE audit_log 
  ADD CONSTRAINT IF NOT EXISTS check_audit_hash_format
  CHECK (
    hash_current IS NULL OR 
    (hash_current ~ '^[a-f0-9]{64}$' AND LENGTH(hash_current) = 64)
  );
\echo '✅ check_audit_hash_format dodat'

-- Hash prev format - SHA-256 = 64 hex karaktera
ALTER TABLE audit_log 
  ADD CONSTRAINT IF NOT EXISTS check_audit_hash_prev_format
  CHECK (
    hash_prev IS NULL OR 
    (hash_prev ~ '^[a-f0-9]{64}$' AND LENGTH(hash_prev) = 64)
  );
\echo '✅ check_audit_hash_prev_format dodat'

-- Occurred_at ne smije biti u budućnosti
ALTER TABLE audit_log
  ADD CONSTRAINT IF NOT EXISTS check_audit_occurred_at_not_future
  CHECK (occurred_at <= NOW() + INTERVAL '5 minutes');  -- 5 min tolerancija za clock skew
\echo '✅ check_audit_occurred_at_not_future dodat'

-- Target type validacija
ALTER TABLE audit_log
  ADD CONSTRAINT IF NOT EXISTS check_audit_target_type
  CHECK (
    target_type IS NULL OR
    target_type IN ('USER', 'OPERATOR', 'SYSTEM', 'SESSION', 'ROLE', 'AGENCY')
  );
\echo '✅ check_audit_target_type dodat'

-- ==================== AGENCY ====================

-- Agency code format (uppercase alfanumerik + underscore)
ALTER TABLE agency
  ADD CONSTRAINT IF NOT EXISTS check_agency_code_format
  CHECK (code ~ '^[A-Z0-9_]{2,50}$');
\echo '✅ check_agency_code_format dodat'

-- Agency name ne smije biti prazan
ALTER TABLE agency
  ADD CONSTRAINT IF NOT EXISTS check_agency_name_not_empty
  CHECK (LENGTH(TRIM(name)) > 0);
\echo '✅ check_agency_name_not_empty dodat'

-- ==================== SESSION ====================

-- Session expires_at mora biti u budućnosti pri kreiranju
-- (ovo se provjerava aplikativno, ali dodajemo kao dodatnu zaštitu)
ALTER TABLE session
  ADD CONSTRAINT IF NOT EXISTS check_session_expires_at_future
  CHECK (expires_at > created_at);
\echo '✅ check_session_expires_at_future dodat'

-- ==================== LEGAL_BASIS ====================

-- Reference number ne smije biti prazan
ALTER TABLE legal_basis
  ADD CONSTRAINT IF NOT EXISTS check_legal_basis_ref_not_empty
  CHECK (LENGTH(TRIM(reference_no)) > 0);
\echo '✅ check_legal_basis_ref_not_empty dodat'

-- Issued_at ne smije biti u budućnosti
ALTER TABLE legal_basis
  ADD CONSTRAINT IF NOT EXISTS check_legal_basis_issued_at_not_future
  CHECK (issued_at IS NULL OR issued_at <= CURRENT_DATE);
\echo '✅ check_legal_basis_issued_at_not_future dodat'

\echo ''
\echo '🎉 Svi CHECK constraints su uspješno dodati!'
\echo ''
\echo 'Testiranje constraints:'
\echo '======================='
\echo ''
\echo '-- Pokušaj unijeti invalid email (očekuje ERROR)'
\echo 'INSERT INTO app_user (username, pass_hash, email) VALUES (''test'', ''hash123'', ''invalid-email'');'
\echo ''
\echo '-- Pokušaj unijeti invalid operator status (očekuje ERROR)'
\echo 'INSERT INTO operator (legal_name, status) VALUES (''Test Operator'', ''invalid-status'');'
\echo ''
\echo '-- Validni insert'
\echo 'INSERT INTO operator (legal_name, status) VALUES (''Test Operator'', ''aktivan'');'

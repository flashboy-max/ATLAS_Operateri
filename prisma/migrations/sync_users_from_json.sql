-- Sync User data from JSON to PostgreSQL
-- Run: docker exec -i atlas-postgres psql -U atlas_user -d atlas_db < prisma/migrations/sync_users_from_json.sql

BEGIN;

-- User ID 1: admin (SUPERADMIN)
UPDATE app_user SET
    role = 'SUPERADMIN',
    first_name = 'Aleksandar',
    last_name = 'Jovičić',
    email = 'admin@atlas.ba',
    agency_id = NULL,
    agency_name = 'Sistem administrator',
    mfa_enabled = false,
    last_login = '2025-10-06T08:30:53.385Z'::timestamp,
    created_by = NULL
WHERE id = 1;

-- User ID 2: admin_ks (ADMIN)
UPDATE app_user SET
    role = 'ADMIN',
    first_name = 'Kemal',
    last_name = 'Kemo',
    email = 'kemal.kemo@mup-ks.gov.ba',
    agency_id = NULL, -- Will be set after agency migration
    agency_name = 'Ministarstvo unutrašnjih poslova Kantona Sarajevo',
    mfa_enabled = false,
    last_login = '2025-10-06T11:26:46.315Z'::timestamp,
    created_by = NULL
WHERE id = 2;

-- User ID 3: korisnik_ks (USER -> KORISNIK)
UPDATE app_user SET
    role = 'KORISNIK',
    first_name = 'Amira',
    last_name = 'Amirica',
    email = 'amira.amirica@mup-ks.gov.ba',
    agency_id = NULL, -- Will be set after agency migration
    agency_name = 'Ministarstvo unutrašnjih poslova Kantona Sarajevo',
    mfa_enabled = false,
    created_by = NULL
WHERE id = 3;

-- User ID 4: admin_una (ADMIN)
UPDATE app_user SET
    role = 'ADMIN',
    first_name = 'Nedzad',
    last_name = 'Nedzo',
    email = 'nedzad.nedzo@mup-una.gov.ba',
    agency_id = NULL, -- Will be set after agency migration
    agency_name = 'Ministarstvo unutrašnjih poslova Unsko-sanskog kantona',
    mfa_enabled = false,
    created_by = NULL
WHERE id = 4;

COMMIT;

-- Verify results
SELECT id, username, role, first_name, last_name, agency_name, is_active
FROM app_user
ORDER BY id;

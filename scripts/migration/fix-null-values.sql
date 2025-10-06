-- NULL VALUES FIX - Operator Table
-- Date: October 6, 2025

-- 1. FIX Supernova (ID 24) - dodati operator_types, commercial_name i description
UPDATE operator 
SET operator_types = '["isp"]'::jsonb,
    commercial_name = 'Supernova',
    description = 'Telekomunikacioni operater (Blicnet grupa)'
WHERE id = 24;

-- 2. FIX M&H Company (ID 18) - dodati commercial_name i description
UPDATE operator 
SET commercial_name = 'M&H Company',
    description = 'Internet provajder - FTTH i Fixed Wireless usluge'
WHERE id = 18;

-- 3. Ekstraktovati kontakt podatke iz contact_info JSON-a
UPDATE operator 
SET contact_email = contact_info->>'email',
    contact_phone = contact_info->>'telefon'
WHERE contact_info IS NOT NULL;

-- 4. Popuniti manjkajuče contact_person
UPDATE operator 
SET contact_person = 'N/A'
WHERE contact_person IS NULL OR contact_person = '';

-- 5. Verifikacija rezultata
SELECT 
    COUNT(*) as total,
    COUNT(commercial_name) as has_commercial_name,
    COUNT(description) as has_description,
    COUNT(contact_person) as has_contact_person,
    COUNT(contact_email) as has_email,
    COUNT(contact_phone) as has_phone,
    COUNT(operator_types) as has_types
FROM operator;

-- 6. Provjera problematičnih operatera (18 i 24)
SELECT id, commercial_name, description, operator_types::text, contact_person
FROM operator 
WHERE id IN (18, 24);

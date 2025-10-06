/*
  User model migration - Auth fields compatibility
  - Rename pass_hash -> password_hash (preserve data)
  - Split full_name -> first_name + last_name (extract data)
  - Add role field with default 'KORISNIK'
  - Add agency_name field (nullable)
  - Add created_by field (nullable)
*/

-- Step 1: Rename pass_hash to password_hash (preserves existing data)
ALTER TABLE "app_user" RENAME COLUMN "pass_hash" TO "password_hash";

-- Step 2: Add new columns with nullable defaults
ALTER TABLE "app_user" ADD COLUMN "role" VARCHAR(50) DEFAULT 'KORISNIK';
ALTER TABLE "app_user" ADD COLUMN "first_name" VARCHAR(100);
ALTER TABLE "app_user" ADD COLUMN "last_name" VARCHAR(100);
ALTER TABLE "app_user" ADD COLUMN "agency_name" VARCHAR(255);
ALTER TABLE "app_user" ADD COLUMN "created_by" BIGINT;

-- Step 3: Migrate full_name -> first_name (simple copy for now)
UPDATE "app_user" SET "first_name" = "full_name" WHERE "full_name" IS NOT NULL;

-- Step 4: Drop old full_name column
ALTER TABLE "app_user" DROP COLUMN "full_name";

-- Step 5: Make role NOT NULL with default (now that all rows have values)
ALTER TABLE "app_user" ALTER COLUMN "role" SET NOT NULL;

-- Step 6: Create index on role for faster queries
CREATE INDEX "app_user_role_idx" ON "app_user"("role");

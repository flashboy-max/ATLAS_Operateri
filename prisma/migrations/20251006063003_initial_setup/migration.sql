-- CreateEnum
CREATE TYPE "audit_action" AS ENUM ('LOGIN_SUCCESS', 'LOGIN_FAILURE', 'LOGOUT', 'TOKEN_REFRESH', 'SESSION_EXPIRED', 'USER_CREATE', 'USER_UPDATE', 'USER_DELETE', 'USER_STATUS_CHANGE', 'OPERATOR_CREATE', 'OPERATOR_UPDATE', 'OPERATOR_DELETE', 'OPERATOR_SEARCH', 'OPERATOR_VIEW', 'SYSTEM_ERROR', 'SECURITY_ALERT', 'UNAUTHORIZED_ACCESS');

-- CreateEnum
CREATE TYPE "audit_status" AS ENUM ('SUCCESS', 'FAILED', 'ERROR', 'DENIED');

-- CreateTable
CREATE TABLE "agency" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_user" (
    "id" BIGSERIAL NOT NULL,
    "agency_id" BIGINT,
    "username" VARCHAR(150) NOT NULL,
    "pass_hash" TEXT NOT NULL,
    "email" VARCHAR(255),
    "full_name" VARCHAR(255),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "mfa_enabled" BOOLEAN NOT NULL DEFAULT false,
    "mfa_secret" TEXT,
    "last_login" TIMESTAMP(3),
    "last_activity" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_role" (
    "user_id" BIGINT NOT NULL,
    "role_id" BIGINT NOT NULL,

    CONSTRAINT "user_role_pkey" PRIMARY KEY ("user_id","role_id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "access_token" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "ip_address" INET,
    "user_agent" TEXT,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operator" (
    "id" BIGSERIAL NOT NULL,
    "legal_name" VARCHAR(200) NOT NULL,
    "commercial_name" VARCHAR(200),
    "status" VARCHAR(50) NOT NULL DEFAULT 'aktivan',
    "description" TEXT,
    "notes" TEXT,
    "category" VARCHAR(50),
    "operator_types" JSONB,
    "contact_info" JSONB,
    "technical_contacts" JSONB,
    "services" JSONB,
    "technologies" JSONB,
    "legal_obligations" JSONB,
    "last_updated" VARCHAR(20),
    "contact_person" VARCHAR(200),
    "api_base_url" TEXT,
    "contact_email" VARCHAR(255),
    "contact_phone" VARCHAR(50),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "operator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operator_capability" (
    "id" BIGSERIAL NOT NULL,
    "operator_id" BIGINT NOT NULL,
    "capability" VARCHAR(100) NOT NULL,

    CONSTRAINT "operator_capability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operator_endpoint" (
    "id" BIGSERIAL NOT NULL,
    "operator_id" BIGINT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "method" VARCHAR(10) NOT NULL,
    "path" TEXT NOT NULL,
    "version" VARCHAR(20) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "operator_endpoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "legal_basis" (
    "id" BIGSERIAL NOT NULL,
    "reference_no" VARCHAR(200) NOT NULL,
    "issuer" VARCHAR(200),
    "issued_at" DATE,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "legal_basis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "id" BIGSERIAL NOT NULL,
    "occurred_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actor_user_id" BIGINT,
    "actor_agency_id" BIGINT,
    "action" "audit_action" NOT NULL,
    "action_display" VARCHAR(255),
    "status" "audit_status" NOT NULL,
    "target_type" VARCHAR(50),
    "target_id" BIGINT,
    "target_display" VARCHAR(255),
    "legal_basis_id" BIGINT,
    "ip_address" INET,
    "user_agent" TEXT,
    "session_id" VARCHAR(100),
    "metadata" JSONB,
    "hash_prev" VARCHAR(64),
    "hash_current" VARCHAR(64),

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "agency_name_key" ON "agency"("name");

-- CreateIndex
CREATE UNIQUE INDEX "agency_code_key" ON "agency"("code");

-- CreateIndex
CREATE UNIQUE INDEX "role_name_key" ON "role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "app_user_username_key" ON "app_user"("username");

-- CreateIndex
CREATE INDEX "app_user_agency_id_idx" ON "app_user"("agency_id");

-- CreateIndex
CREATE INDEX "app_user_username_idx" ON "app_user"("username");

-- CreateIndex
CREATE INDEX "app_user_email_idx" ON "app_user"("email");

-- CreateIndex
CREATE INDEX "session_user_id_idx" ON "session"("user_id");

-- CreateIndex
CREATE INDEX "session_access_token_idx" ON "session"("access_token");

-- CreateIndex
CREATE INDEX "session_refresh_token_idx" ON "session"("refresh_token");

-- CreateIndex
CREATE INDEX "session_expires_at_idx" ON "session"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "operator_legal_name_key" ON "operator"("legal_name");

-- CreateIndex
CREATE INDEX "operator_legal_name_idx" ON "operator"("legal_name");

-- CreateIndex
CREATE INDEX "operator_commercial_name_idx" ON "operator"("commercial_name");

-- CreateIndex
CREATE INDEX "operator_status_idx" ON "operator"("status");

-- CreateIndex
CREATE INDEX "operator_category_idx" ON "operator"("category");

-- CreateIndex
CREATE INDEX "operator_is_active_idx" ON "operator"("is_active");

-- CreateIndex
CREATE INDEX "operator_capability_capability_idx" ON "operator_capability"("capability");

-- CreateIndex
CREATE UNIQUE INDEX "operator_capability_operator_id_capability_key" ON "operator_capability"("operator_id", "capability");

-- CreateIndex
CREATE INDEX "operator_endpoint_operator_id_idx" ON "operator_endpoint"("operator_id");

-- CreateIndex
CREATE UNIQUE INDEX "operator_endpoint_operator_id_name_version_key" ON "operator_endpoint"("operator_id", "name", "version");

-- CreateIndex
CREATE INDEX "legal_basis_reference_no_idx" ON "legal_basis"("reference_no");

-- CreateIndex
CREATE INDEX "audit_log_occurred_at_idx" ON "audit_log"("occurred_at" DESC);

-- CreateIndex
CREATE INDEX "audit_log_actor_user_id_occurred_at_idx" ON "audit_log"("actor_user_id", "occurred_at" DESC);

-- CreateIndex
CREATE INDEX "audit_log_action_occurred_at_idx" ON "audit_log"("action", "occurred_at" DESC);

-- CreateIndex
CREATE INDEX "audit_log_target_type_target_id_occurred_at_idx" ON "audit_log"("target_type", "target_id", "occurred_at" DESC);

-- CreateIndex
CREATE INDEX "audit_log_status_occurred_at_idx" ON "audit_log"("status", "occurred_at" DESC);

-- CreateIndex
CREATE INDEX "audit_log_ip_address_occurred_at_idx" ON "audit_log"("ip_address", "occurred_at" DESC);

-- AddForeignKey
ALTER TABLE "app_user" ADD CONSTRAINT "app_user_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "agency"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operator_capability" ADD CONSTRAINT "operator_capability_operator_id_fkey" FOREIGN KEY ("operator_id") REFERENCES "operator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operator_endpoint" ADD CONSTRAINT "operator_endpoint_operator_id_fkey" FOREIGN KEY ("operator_id") REFERENCES "operator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_actor_agency_id_fkey" FOREIGN KEY ("actor_agency_id") REFERENCES "agency"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_legal_basis_id_fkey" FOREIGN KEY ("legal_basis_id") REFERENCES "legal_basis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

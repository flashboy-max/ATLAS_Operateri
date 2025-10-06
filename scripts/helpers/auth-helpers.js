/**
 * Auth Helper Functions
 * Data transformation between JSON format and Prisma User model
 */

/**
 * Maps JSON user data to Prisma User model format
 * @param {Object} jsonData - User data from JSON file
 * @returns {Object} - Prisma User model data
 */
export function mapJsonToPrisma(jsonData) {
    return {
        id: BigInt(jsonData.id),
        username: jsonData.username,
        passwordHash: jsonData.password_hash,
        role: jsonData.role || 'KORISNIK',
        firstName: jsonData.ime || null,
        lastName: jsonData.prezime || null,
        email: jsonData.email || null,
        agencyId: jsonData.agencija ? BigInt(jsonData.agencija) : null,
        agencyName: jsonData.agencija_naziv || null,
        isActive: jsonData.aktivan !== undefined ? jsonData.aktivan : true,
        mfaEnabled: jsonData.mfa_enabled || false,
        mfaSecret: jsonData.mfa_secret || null,
        lastLogin: jsonData.poslednje_logovanje ? new Date(jsonData.poslednje_logovanje) : null,
        createdAt: jsonData.datum_kreiranja ? new Date(jsonData.datum_kreiranja) : new Date(),
        updatedAt: new Date()
    };
}

/**
 * Maps Prisma User model to JSON format (for backward compatibility)
 * @param {Object} prismaData - User data from Prisma
 * @returns {Object} - JSON format user data
 */
export function mapPrismaToJson(prismaData) {
    return {
        id: Number(prismaData.id),
        username: prismaData.username,
        password_hash: prismaData.passwordHash,
        role: prismaData.role || 'KORISNIK',
        ime: prismaData.firstName || null,
        prezime: prismaData.lastName || null,
        email: prismaData.email || null,
        agencija: prismaData.agencyId ? Number(prismaData.agencyId) : null,
        agencija_naziv: prismaData.agencyName || null,
        aktivan: prismaData.isActive !== undefined ? prismaData.isActive : true,
        mfa_enabled: prismaData.mfaEnabled || false,
        mfa_secret: prismaData.mfaSecret || null,
        poslednje_logovanje: prismaData.lastLogin ? prismaData.lastLogin.toISOString() : null,
        datum_kreiranja: prismaData.createdAt ? prismaData.createdAt.toISOString() : new Date().toISOString()
    };
}

/**
 * Sanitizes user object by removing sensitive fields
 * @param {Object} user - User object (Prisma or JSON format)
 * @param {boolean} isPrismaFormat - Whether input is Prisma format
 * @returns {Object} - Sanitized user object
 */
export function sanitizeUser(user, isPrismaFormat = false) {
    if (!user) return null;
    
    if (isPrismaFormat) {
        // Prisma format
        const { passwordHash, mfaSecret, agency, ...safeUser } = user;
        return {
            id: Number(safeUser.id),
            username: safeUser.username,
            role: safeUser.role,
            ime: safeUser.firstName,
            prezime: safeUser.lastName,
            email: safeUser.email,
            agencija: agency?.code || null,  // Use agency CODE (MUP_KS) for filtering compatibility
            agencija_naziv: safeUser.agencyName || agency?.name || null,
            aktivan: safeUser.isActive,
            mfa_enabled: safeUser.mfaEnabled,
            poslednje_logovanje: safeUser.lastLogin ? safeUser.lastLogin.toISOString() : null,
            datum_kreiranja: safeUser.createdAt ? safeUser.createdAt.toISOString() : null
        };
    } else {
        // JSON format
        const { password_hash, mfa_secret, ...safeUser } = user;
        return safeUser;
    }
}

/**
 * Maps Prisma User to basic info for listings
 * @param {Object} prismaData - User data from Prisma
 * @returns {Object} - Basic user info
 */
export function mapPrismaToBasicInfo(prismaData) {
    return {
        id: Number(prismaData.id),
        username: prismaData.username,
        ime: prismaData.firstName || null,
        prezime: prismaData.lastName || null,
        role: prismaData.role,
        agencija_naziv: prismaData.agencyName || null,
        aktivan: prismaData.isActive,
        poslednje_logovanje: prismaData.lastLogin ? prismaData.lastLogin.toISOString() : null
    };
}

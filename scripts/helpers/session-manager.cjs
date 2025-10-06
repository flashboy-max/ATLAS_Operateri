/**
 * Session Manager Module
 * 
 * Purpose:
 * - Manage user sessions in Redis
 * - Support multiple concurrent sessions per user (multi-device)
 * - Track session metadata (device, IP, last activity)
 * - Refresh token management
 * 
 * Data Structure:
 * - session:{sessionId} -> hash (userId, username, role, deviceInfo, createdAt, lastActivity)
 * - user:{userId}:sessions -> set (sessionId1, sessionId2, ...)
 * - refresh:{refreshToken} -> string (sessionId)
 * 
 * TTL Strategy:
 * - Access token: 15 minutes (JWT, not stored in Redis)
 * - Session: 7 days (auto-refresh on activity)
 * - Refresh token: 7 days (one-time use)
 */

const redis = require('./redis-client.cjs');
const crypto = require('crypto');

const SESSION_TTL = 7 * 24 * 60 * 60; // 7 days in seconds
const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60; // 7 days in seconds

class SessionManager {
    
    /**
     * Create a new session
     * @param {number} userId - User ID
     * @param {object} userData - User data (username, role, full_name, email, etc.)
     * @param {object} deviceInfo - Device information (ip, userAgent, deviceName)
     * @returns {Promise<{sessionId: string, refreshToken: string}>}
     */
    async createSession(userId, userData, deviceInfo = {}) {
        try {
            // Generate unique session ID (UUID v4)
            const sessionId = crypto.randomUUID();
            
            // Generate refresh token (secure random)
            const refreshToken = crypto.randomBytes(32).toString('hex');
            
            const now = new Date().toISOString();
            
            // Session data
            const sessionData = {
                userId: userId.toString(),
                username: userData.username,
                role: userData.role,
                full_name: userData.full_name || '',
                email: userData.email || '',
                agencija: userData.agencija || '',
                agencija_naziv: userData.agencija_naziv || '',
                
                // Device info
                ip: deviceInfo.ip || 'unknown',
                userAgent: deviceInfo.userAgent || 'unknown',
                deviceName: deviceInfo.deviceName || 'Unknown Device',
                
                // Timestamps
                createdAt: now,
                lastActivity: now
            };
            
            // Store session in Redis (hash)
            await redis.hset(`session:${sessionId}`, sessionData);
            await redis.expire(`session:${sessionId}`, SESSION_TTL);
            
            // Add session to user's session set
            await redis.sadd(`user:${userId}:sessions`, sessionId);
            await redis.expire(`user:${userId}:sessions`, SESSION_TTL);
            
            // Store refresh token (maps to sessionId)
            await redis.set(`refresh:${refreshToken}`, sessionId, 'EX', REFRESH_TOKEN_TTL);
            
            console.log(`✅ [SessionManager] Session created: ${sessionId} for user ${userData.username} (${deviceInfo.deviceName})`);
            
            return { sessionId, refreshToken };
            
        } catch (error) {
            console.error('❌ [SessionManager] Error creating session:', error);
            throw error;
        }
    }
    
    /**
     * Get session data
     * @param {string} sessionId - Session ID
     * @returns {Promise<object|null>} - Session data or null if not found
     */
    async getSession(sessionId) {
        try {
            const sessionData = await redis.hgetall(`session:${sessionId}`);
            
            if (!sessionData || Object.keys(sessionData).length === 0) {
                return null;
            }
            
            // Convert userId back to number
            sessionData.userId = parseInt(sessionData.userId);
            
            return sessionData;
            
        } catch (error) {
            console.error('❌ [SessionManager] Error getting session:', error);
            throw error;
        }
    }
    
    /**
     * Update session last activity timestamp
     * @param {string} sessionId - Session ID
     * @returns {Promise<boolean>} - Success status
     */
    async updateSession(sessionId) {
        try {
            const exists = await redis.exists(`session:${sessionId}`);
            if (!exists) {
                return false;
            }
            
            const now = new Date().toISOString();
            await redis.hset(`session:${sessionId}`, 'lastActivity', now);
            
            // Refresh TTL
            await redis.expire(`session:${sessionId}`, SESSION_TTL);
            
            return true;
            
        } catch (error) {
            console.error('❌ [SessionManager] Error updating session:', error);
            throw error;
        }
    }
    
    /**
     * Delete a session
     * @param {string} sessionId - Session ID
     * @returns {Promise<boolean>} - Success status
     */
    async deleteSession(sessionId) {
        try {
            // Get session to find userId
            const sessionData = await this.getSession(sessionId);
            if (!sessionData) {
                return false;
            }
            
            const userId = sessionData.userId;
            
            // Delete session
            await redis.del(`session:${sessionId}`);
            
            // Remove from user's session set
            await redis.srem(`user:${userId}:sessions`, sessionId);
            
            // Find and delete associated refresh token
            // Note: This requires scanning refresh tokens (alternative: store refreshToken in session hash)
            // For now, we'll let refresh tokens expire naturally
            
            console.log(`🗑️  [SessionManager] Session deleted: ${sessionId}`);
            return true;
            
        } catch (error) {
            console.error('❌ [SessionManager] Error deleting session:', error);
            throw error;
        }
    }
    
    /**
     * Get all sessions for a user
     * @param {number} userId - User ID
     * @returns {Promise<Array<object>>} - Array of session objects
     */
    async getUserSessions(userId) {
        try {
            // Get session IDs from set
            const sessionIds = await redis.smembers(`user:${userId}:sessions`);
            
            if (sessionIds.length === 0) {
                return [];
            }
            
            // Get session data for each ID
            const sessions = [];
            for (const sessionId of sessionIds) {
                const sessionData = await this.getSession(sessionId);
                if (sessionData) {
                    sessions.push({
                        sessionId,
                        ...sessionData
                    });
                }
            }
            
            // Sort by lastActivity (most recent first)
            sessions.sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));
            
            return sessions;
            
        } catch (error) {
            console.error('❌ [SessionManager] Error getting user sessions:', error);
            throw error;
        }
    }
    
    /**
     * Delete all sessions for a user (logout from all devices)
     * @param {number} userId - User ID
     * @returns {Promise<number>} - Number of sessions deleted
     */
    async deleteAllUserSessions(userId) {
        try {
            const sessionIds = await redis.smembers(`user:${userId}:sessions`);
            
            if (sessionIds.length === 0) {
                return 0;
            }
            
            // Delete each session
            for (const sessionId of sessionIds) {
                await redis.del(`session:${sessionId}`);
            }
            
            // Delete user's session set
            await redis.del(`user:${userId}:sessions`);
            
            console.log(`🗑️  [SessionManager] All sessions deleted for user ${userId}: ${sessionIds.length} sessions`);
            return sessionIds.length;
            
        } catch (error) {
            console.error('❌ [SessionManager] Error deleting all user sessions:', error);
            throw error;
        }
    }
    
    /**
     * Verify refresh token and get session ID
     * @param {string} refreshToken - Refresh token
     * @returns {Promise<string|null>} - Session ID or null if invalid
     */
    async verifyRefreshToken(refreshToken) {
        try {
            const sessionId = await redis.get(`refresh:${refreshToken}`);
            return sessionId;
            
        } catch (error) {
            console.error('❌ [SessionManager] Error verifying refresh token:', error);
            throw error;
        }
    }
    
    /**
     * Delete refresh token (after use)
     * @param {string} refreshToken - Refresh token
     * @returns {Promise<boolean>} - Success status
     */
    async deleteRefreshToken(refreshToken) {
        try {
            const result = await redis.del(`refresh:${refreshToken}`);
            return result > 0;
            
        } catch (error) {
            console.error('❌ [SessionManager] Error deleting refresh token:', error);
            throw error;
        }
    }
    
    /**
     * Create new refresh token for existing session (token rotation)
     * @param {string} sessionId - Session ID
     * @returns {Promise<string>} - New refresh token
     */
    async rotateRefreshToken(sessionId) {
        try {
            const newRefreshToken = crypto.randomBytes(32).toString('hex');
            await redis.set(`refresh:${newRefreshToken}`, sessionId, 'EX', REFRESH_TOKEN_TTL);
            
            return newRefreshToken;
            
        } catch (error) {
            console.error('❌ [SessionManager] Error rotating refresh token:', error);
            throw error;
        }
    }
}

module.exports = new SessionManager();

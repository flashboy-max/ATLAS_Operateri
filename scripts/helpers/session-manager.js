/**
 * Session Manager Module (ES Module version)
 * 
 * Purpose:
 * - Manage user sessions in Redis
 * - Support multiple concurrent sessions per user (multi-device)
 * - Track session metadata (device, IP, last activity)
 * - Refresh token management
 */

import redis from './redis-client.js';
import crypto from 'crypto';

const SESSION_TTL = 7 * 24 * 60 * 60; // 7 days in seconds
const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60; // 7 days in seconds

class SessionManager {
    
    /**
     * Create a new session
     */
    async createSession(userId, userData, deviceInfo = {}) {
        try {
            const sessionId = crypto.randomUUID();
            const refreshToken = crypto.randomBytes(32).toString('hex');
            const now = new Date().toISOString();
            
            const sessionData = {
                userId: userId.toString(),
                username: userData.username,
                role: userData.role,
                full_name: userData.full_name || '',
                email: userData.email || '',
                agencija: userData.agencija || '',
                agencija_naziv: userData.agencija_naziv || '',
                ip: deviceInfo.ip || 'unknown',
                userAgent: deviceInfo.userAgent || 'unknown',
                deviceName: deviceInfo.deviceName || 'Unknown Device',
                createdAt: now,
                lastActivity: now
            };
            
            await redis.hset(`session:${sessionId}`, sessionData);
            await redis.expire(`session:${sessionId}`, SESSION_TTL);
            await redis.sadd(`user:${userId}:sessions`, sessionId);
            await redis.expire(`user:${userId}:sessions`, SESSION_TTL);
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
     */
    async getSession(sessionId) {
        try {
            const sessionData = await redis.hgetall(`session:${sessionId}`);
            
            if (!sessionData || Object.keys(sessionData).length === 0) {
                return null;
            }
            
            sessionData.userId = parseInt(sessionData.userId);
            return sessionData;
            
        } catch (error) {
            console.error('❌ [SessionManager] Error getting session:', error);
            throw error;
        }
    }
    
    /**
     * Update session last activity timestamp
     */
    async updateSession(sessionId) {
        try {
            const exists = await redis.exists(`session:${sessionId}`);
            if (!exists) {
                return false;
            }
            
            const now = new Date().toISOString();
            await redis.hset(`session:${sessionId}`, 'lastActivity', now);
            await redis.expire(`session:${sessionId}`, SESSION_TTL);
            
            return true;
            
        } catch (error) {
            console.error('❌ [SessionManager] Error updating session:', error);
            throw error;
        }
    }
    
    /**
     * Delete a session
     */
    async deleteSession(sessionId) {
        try {
            const sessionData = await this.getSession(sessionId);
            if (!sessionData) {
                return false;
            }
            
            const userId = sessionData.userId;
            await redis.del(`session:${sessionId}`);
            await redis.srem(`user:${userId}:sessions`, sessionId);
            
            console.log(`🗑️  [SessionManager] Session deleted: ${sessionId}`);
            return true;
            
        } catch (error) {
            console.error('❌ [SessionManager] Error deleting session:', error);
            throw error;
        }
    }
    
    /**
     * Get all sessions for a user
     */
    async getUserSessions(userId) {
        try {
            const sessionIds = await redis.smembers(`user:${userId}:sessions`);
            
            if (sessionIds.length === 0) {
                return [];
            }
            
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
            
            sessions.sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));
            return sessions;
            
        } catch (error) {
            console.error('❌ [SessionManager] Error getting user sessions:', error);
            throw error;
        }
    }
    
    /**
     * Delete all sessions for a user
     */
    async deleteAllUserSessions(userId) {
        try {
            const sessionIds = await redis.smembers(`user:${userId}:sessions`);
            
            if (sessionIds.length === 0) {
                return 0;
            }
            
            for (const sessionId of sessionIds) {
                await redis.del(`session:${sessionId}`);
            }
            
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
     * Delete refresh token
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
     * Create new refresh token for existing session
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

export default new SessionManager();

const db = require("../database");

/**
 * Create a new user (unverified by default)
 */
function createUser(name, email, passwordHash) {
    const stmt = db.prepare(`
        INSERT INTO users (name, email, password, is_verified)
        VALUES (?, ?, ?, 0)
    `);
    const info = stmt.run(name, email, passwordHash);
    return info.lastInsertRowid;
}

/**
 * Find a user by email
 */
function findUserByEmail(email) {
    return db.prepare("SELECT * FROM users WHERE email = ?").get(email);
}

/**
 * Find a user by ID
 */
function findUserById(id) {
    return db.prepare("SELECT id, name, email, is_verified, created_at FROM users WHERE id = ?").get(id);
}

/**
 * Save OTP code + expiry for a user
 */
function saveOtp(userId, otpCode, otpExpiresAt) {
    db.prepare(`
        UPDATE users SET otp_code = ?, otp_expires_at = ? WHERE id = ?
    `).run(otpCode, otpExpiresAt, userId);
}

/**
 * Verify OTP — returns true if valid and not expired, marks user as verified
 */
function verifyOtp(email, otpCode) {
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (!user) return { ok: false, error: "User not found" };
    if (user.is_verified) return { ok: true, user }; // already verified

    if (!user.otp_code || user.otp_code !== otpCode) {
        return { ok: false, error: "Invalid verification code" };
    }

    const now = new Date();
    const expires = new Date(user.otp_expires_at);
    if (now > expires) {
        return { ok: false, error: "Verification code has expired. Please request a new one." };
    }

    // Mark verified and clear OTP
    db.prepare(`
        UPDATE users SET is_verified = 1, otp_code = NULL, otp_expires_at = NULL WHERE id = ?
    `).run(user.id);

    return { ok: true, user };
}

module.exports = { createUser, findUserByEmail, findUserById, saveOtp, verifyOtp };

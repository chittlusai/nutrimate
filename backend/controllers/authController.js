const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createUser, findUserByEmail, findUserById, saveOtp, verifyOtp } = require("../db/queries/users");
const { JWT_SECRET } = require("../middleware/auth");
const { sendOtpEmail, generateOtp, getOtpExpiry } = require("../services/emailService");

// ─── Helpers ─────────────────────────────────────────────────

function issueToken(user) {
    return jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        JWT_SECRET,
        { expiresIn: "30d" }
    );
}

// ─── Endpoints ────────────────────────────────────────────────

/**
 * POST /api/auth/register
 * Creates unverified user and sends OTP email
 */
async function register(req, res) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password)
            return res.status(400).json({ error: "Name, email and password are required" });

        if (password.length < 6)
            return res.status(400).json({ error: "Password must be at least 6 characters" });

        const cleanEmail = email.toLowerCase().trim();

        // Check if email already exists
        const existing = findUserByEmail(cleanEmail);
        if (existing) {
            if (existing.is_verified) {
                return res.status(409).json({ error: "Email already registered. Please login." });
            }
            // Unverified — resend OTP
            const otp = generateOtp();
            saveOtp(existing.id, otp, getOtpExpiry());
            await sendOtpEmail(cleanEmail, existing.name, otp);
            return res.json({ otpSent: true, email: cleanEmail, message: "Verification code resent to your email" });
        }

        // Hash password
        const hash = await bcrypt.hash(password, 12);

        // Create unverified user
        const userId = createUser(name.trim(), cleanEmail, hash);

        // Generate and save OTP
        const otp = generateOtp();
        saveOtp(userId, otp, getOtpExpiry());

        // Send email (non-blocking on failure — log but continue)
        try {
            await sendOtpEmail(cleanEmail, name.trim(), otp);
        } catch (mailErr) {
            console.error("📧 Email send failed:", mailErr.message);
            // In dev, log the OTP so you can still test
            console.log(`🔑 DEV OTP for ${cleanEmail}: ${otp}`);
        }

        return res.status(201).json({
            otpSent: true,
            email: cleanEmail,
            message: "Account created! Check your email for the verification code."
        });

    } catch (err) {
        console.error("Register error:", err);
        return res.status(500).json({ error: "Registration failed" });
    }
}

/**
 * POST /api/auth/verify-email
 * Body: { email, otp }
 */
function verifyEmail(req, res) {
    try {
        const { email, otp } = req.body;
        if (!email || !otp)
            return res.status(400).json({ error: "Email and code are required" });

        const result = verifyOtp(email.toLowerCase().trim(), otp.trim());
        if (!result.ok) return res.status(400).json({ error: result.error });

        const token = issueToken(result.user);
        return res.json({
            token,
            user: { id: result.user.id, name: result.user.name, email: result.user.email }
        });

    } catch (err) {
        console.error("Verify OTP error:", err);
        return res.status(500).json({ error: "Verification failed" });
    }
}

/**
 * POST /api/auth/resend-otp
 * Body: { email }
 */
async function resendOtp(req, res) {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: "Email is required" });

        const user = findUserByEmail(email.toLowerCase().trim());
        if (!user) return res.status(404).json({ error: "Email not found" });
        if (user.is_verified) return res.status(400).json({ error: "Email already verified" });

        const otp = generateOtp();
        saveOtp(user.id, otp, getOtpExpiry());

        try {
            await sendOtpEmail(user.email, user.name, otp);
        } catch (mailErr) {
            console.error("📧 Resend email failed:", mailErr.message);
            console.log(`🔑 DEV OTP for ${user.email}: ${otp}`);
        }

        return res.json({ message: "Verification code resent" });

    } catch (err) {
        console.error("Resend OTP error:", err);
        return res.status(500).json({ error: "Failed to resend code" });
    }
}

/**
 * POST /api/auth/login
 */
async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({ error: "Email and password are required" });

        const user = findUserByEmail(email.toLowerCase().trim());
        if (!user) return res.status(401).json({ error: "Invalid email or password" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: "Invalid email or password" });

        if (!user.is_verified) {
            // Resend OTP automatically
            const otp = generateOtp();
            saveOtp(user.id, otp, getOtpExpiry());
            try {
                await sendOtpEmail(user.email, user.name, otp);
            } catch (e) {
                console.log(`🔑 DEV OTP for ${user.email}: ${otp}`);
            }
            return res.status(403).json({
                error: "Email not verified",
                otpSent: true,
                email: user.email
            });
        }

        const token = issueToken(user);
        return res.json({ token, user: { id: user.id, name: user.name, email: user.email } });

    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ error: "Login failed" });
    }
}

/**
 * GET /api/auth/me
 */
function me(req, res) {
    const user = findUserById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json({ user });
}

module.exports = { register, verifyEmail, resendOtp, login, me };

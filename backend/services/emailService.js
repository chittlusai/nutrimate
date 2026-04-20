const nodemailer = require("nodemailer");

// Create transporter — works with Gmail, Outlook, or any SMTP
function createTransporter() {
    return nodemailer.createTransport({
        host:   process.env.EMAIL_HOST   || "smtp.gmail.com",
        port:   parseInt(process.env.EMAIL_PORT || "587"),
        secure: false, // TLS
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
}

/**
 * Send OTP verification email
 */
async function sendOtpEmail(toEmail, toName, otp) {
    const transporter = createTransporter();

    const mailOptions = {
        from: `"Nutrimate 🍃" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: "Your Nutrimate Verification Code",
        html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { margin:0; font-family: 'Arial', sans-serif; background:#f4f7fb; }
            .container { max-width:520px; margin:40px auto; background:#fff; border-radius:20px; overflow:hidden; box-shadow:0 8px 30px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #16a34a, #22c55e); padding: 40px 30px; text-align:center; }
            .header h1 { color:white; margin:0; font-size:28px; letter-spacing:1px; }
            .header p { color:rgba(255,255,255,0.85); margin:8px 0 0; font-size:14px; }
            .body { padding: 40px 30px; text-align:center; }
            .greeting { font-size:18px; color:#1e293b; font-weight:600; margin-bottom:10px; }
            .message { font-size:14px; color:#64748b; margin-bottom:30px; line-height:1.6; }
            .otp-box { background: linear-gradient(135deg, #f0fdf4, #dcfce7); border:2px solid #22c55e; border-radius:16px; padding:20px 40px; display:inline-block; margin:0 auto 30px; }
            .otp-code { font-size:42px; font-weight:800; letter-spacing:12px; color:#16a34a; }
            .otp-label { font-size:12px; color:#64748b; margin-top:6px; }
            .expires { font-size:13px; color:#f59e0b; font-weight:600; margin-bottom:20px; }
            .footer { background:#f8fafc; padding:20px; text-align:center; font-size:12px; color:#94a3b8; border-top:1px solid #e2e8f0; }
            .footer a { color:#16a34a; text-decoration:none; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🍃 Nutrimate</h1>
              <p>Smart Nutrition · Verified Health</p>
            </div>
            <div class="body">
              <div class="greeting">Hello, ${toName}! 👋</div>
              <div class="message">
                Thank you for creating your Nutrimate account.<br>
                Use the code below to verify your email address.
              </div>
              <div class="otp-box">
                <div class="otp-code">${otp}</div>
                <div class="otp-label">Verification Code</div>
              </div>
              <div class="expires">⏱ Code expires in 10 minutes</div>
              <div class="message" style="font-size:12px;">
                If you didn't create a Nutrimate account, you can safely ignore this email.
              </div>
            </div>
            <div class="footer">
              &copy; ${new Date().getFullYear()} Nutrimate &bull; Smart Nutrition Platform<br>
              <a href="http://localhost:5000">Visit Nutrimate</a>
            </div>
          </div>
        </body>
        </html>
        `
    };

    await transporter.sendMail(mailOptions);
}

/**
 * Generate 6-digit OTP
 */
function generateOtp() {
    return String(Math.floor(100000 + Math.random() * 900000));
}

/**
 * Get expiry timestamp (10 minutes from now)
 */
function getOtpExpiry() {
    const d = new Date();
    d.setMinutes(d.getMinutes() + 10);
    return d.toISOString();
}

module.exports = { sendOtpEmail, generateOtp, getOtpExpiry };

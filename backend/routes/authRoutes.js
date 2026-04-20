const express = require("express");
const router = express.Router();
const { register, verifyEmail, resendOtp, login, me } = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");

router.post("/register",     register);
router.post("/verify-email", verifyEmail);
router.post("/resend-otp",   resendOtp);
router.post("/login",        login);
router.get("/me",            authenticate, me);

module.exports = router;

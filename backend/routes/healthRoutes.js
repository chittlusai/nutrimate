const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const { getProfile, saveProfile } = require("../controllers/healthController");

router.use(authenticate);
router.get("/", getProfile);
router.post("/", saveProfile);

module.exports = router;

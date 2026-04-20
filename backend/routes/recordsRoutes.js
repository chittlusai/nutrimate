const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const { getAllRecords, getRecordByDate } = require("../controllers/recordsController");

router.use(authenticate);
router.get("/", getAllRecords);
router.get("/:date", getRecordByDate);

module.exports = router;

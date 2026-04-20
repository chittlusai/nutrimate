const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const {
    getTodayMeals, addMealEntry, deleteMealEntry,
    updateMealEntry, saveWeightEntry, getWeightHistoryEntry
} = require("../controllers/nutritionController");

router.use(authenticate);

router.get("/today", getTodayMeals);
router.post("/add", addMealEntry);
router.delete("/:id", deleteMealEntry);
router.patch("/:id", updateMealEntry);
router.post("/weight", saveWeightEntry);
router.get("/weight-history", getWeightHistoryEntry);

module.exports = router;

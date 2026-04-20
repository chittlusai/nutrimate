const {
    addMeal, getMealsToday, getTodayTotals,
    deleteMeal, updateMeal, getMealsByDate, getMealDates,
    saveWeight, getWeightHistory
} = require("../db/queries/nutrition");

/**
 * GET /api/nutrition/today
 */
function getTodayMeals(req, res) {
    try {
        const meals = getMealsToday(req.user.id);
        const totals = getTodayTotals(req.user.id);
        return res.json({ meals, totals });
    } catch (err) {
        console.error("Get today meals error:", err);
        return res.status(500).json({ error: "Failed to fetch today's meals" });
    }
}

/**
 * POST /api/nutrition/add
 * Body: meal object from Gemini analysis
 */
function addMealEntry(req, res) {
    try {
        const meal = req.body;
        if (!meal || !meal.food) {
            return res.status(400).json({ error: "Meal data is required" });
        }
        const id = addMeal(req.user.id, meal);
        return res.status(201).json({ success: true, id });
    } catch (err) {
        console.error("Add meal error:", err);
        return res.status(500).json({ error: "Failed to save meal" });
    }
}

/**
 * DELETE /api/nutrition/:id
 */
function deleteMealEntry(req, res) {
    try {
        const mealId = parseInt(req.params.id);
        const removed = deleteMeal(req.user.id, mealId);
        if (!removed) return res.status(404).json({ error: "Meal not found" });
        return res.json({ success: true });
    } catch (err) {
        console.error("Delete meal error:", err);
        return res.status(500).json({ error: "Failed to delete meal" });
    }
}

/**
 * PATCH /api/nutrition/:id
 * Body: { quantity, grams, calories, protein, carbs, fats }
 */
function updateMealEntry(req, res) {
    try {
        const mealId = parseInt(req.params.id);
        const updated = updateMeal(req.user.id, mealId, req.body);
        if (!updated) return res.status(404).json({ error: "Meal not found" });
        const totals = getTodayTotals(req.user.id);
        return res.json({ success: true, totals });
    } catch (err) {
        console.error("Update meal error:", err);
        return res.status(500).json({ error: "Failed to update meal" });
    }
}

/**
 * POST /api/nutrition/weight
 * Body: { weight, date }  (date = 'YYYY-MM-DD')
 */
function saveWeightEntry(req, res) {
    try {
        const { weight, date } = req.body;
        if (!weight || weight <= 0) {
            return res.status(400).json({ error: "Valid weight is required" });
        }
        const dateStr = date || new Date().toISOString().slice(0, 10);
        saveWeight(req.user.id, weight, dateStr);
        return res.json({ success: true });
    } catch (err) {
        console.error("Save weight error:", err);
        return res.status(500).json({ error: "Failed to save weight" });
    }
}

/**
 * GET /api/nutrition/weight-history
 */
function getWeightHistoryEntry(req, res) {
    try {
        const history = getWeightHistory(req.user.id);
        return res.json({ history });
    } catch (err) {
        console.error("Weight history error:", err);
        return res.status(500).json({ error: "Failed to fetch weight history" });
    }
}

module.exports = {
    getTodayMeals, addMealEntry, deleteMealEntry,
    updateMealEntry, saveWeightEntry, getWeightHistoryEntry
};

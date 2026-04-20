const db = require("../database");

// ─── Meals ────────────────────────────────────────────────────

/**
 * Add a meal record for the user
 */
function addMeal(userId, meal) {
    const stmt = db.prepare(`
        INSERT INTO meals (user_id, food_name, calories, protein, carbs, fats,
                           fiber, sugar, ingredients, description, quantity, grams, image_data)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
        userId,
        meal.food, meal.calories, meal.protein, meal.carbs, meal.fats,
        meal.fiber || 0, meal.sugar || 0,
        JSON.stringify(meal.ingredients || []),
        meal.description || null,
        meal.quantity || 1, meal.grams || 100,
        meal.image || null
    );
    return info.lastInsertRowid;
}

/**
 * Get all meals logged today for a user
 */
function getMealsToday(userId) {
    const rows = db.prepare(`
        SELECT * FROM meals
        WHERE user_id = ?
          AND date(logged_at, 'localtime') = date('now', 'localtime')
        ORDER BY logged_at DESC
    `).all(userId);
    return rows.map(parseMeal);
}

/**
 * Get sum of today's macros for a user
 */
function getTodayTotals(userId) {
    return db.prepare(`
        SELECT
            COALESCE(SUM(calories), 0) AS calories,
            COALESCE(SUM(protein),  0) AS protein,
            COALESCE(SUM(carbs),    0) AS carbs,
            COALESCE(SUM(fats),     0) AS fats,
            COALESCE(SUM(fiber),    0) AS fiber,
            COALESCE(SUM(sugar),    0) AS sugar
        FROM meals
        WHERE user_id = ?
          AND date(logged_at, 'localtime') = date('now', 'localtime')
    `).get(userId);
}

/**
 * Delete a meal (only if it belongs to this user)
 */
function deleteMeal(userId, mealId) {
    const info = db.prepare(`
        DELETE FROM meals WHERE id = ? AND user_id = ?
    `).run(mealId, userId);
    return info.changes > 0;
}

/**
 * Update meal quantity/macros
 */
function updateMeal(userId, mealId, data) {
    const info = db.prepare(`
        UPDATE meals SET
            quantity = ?, grams = ?,
            calories = ?, protein = ?, carbs = ?, fats = ?
        WHERE id = ? AND user_id = ?
    `).run(
        data.quantity, data.grams,
        data.calories, data.protein, data.carbs, data.fats,
        mealId, userId
    );
    return info.changes > 0;
}

/**
 * Get meals for a specific date (YYYY-MM-DD)
 */
function getMealsByDate(userId, dateStr) {
    const rows = db.prepare(`
        SELECT * FROM meals
        WHERE user_id = ?
          AND date(logged_at, 'localtime') = ?
        ORDER BY logged_at ASC
    `).all(userId, dateStr);
    return rows.map(parseMeal);
}

/**
 * Get distinct dates that have meals (last 60 days)
 */
function getMealDates(userId) {
    return db.prepare(`
        SELECT DISTINCT date(logged_at, 'localtime') AS date
        FROM meals
        WHERE user_id = ?
          AND logged_at >= datetime('now', '-60 days')
        ORDER BY date DESC
    `).all(userId);
}

// ─── Weight ───────────────────────────────────────────────────

/**
 * Insert or update weight for a given date (YYYY-MM-DD)
 */
function saveWeight(userId, weightKg, dateStr) {
    db.prepare(`
        INSERT INTO weight_history (user_id, weight_kg, recorded_date)
        VALUES (?, ?, ?)
        ON CONFLICT(user_id, recorded_date) DO UPDATE SET weight_kg = excluded.weight_kg
    `).run(userId, weightKg, dateStr);
}

/**
 * Get weight history for a user
 */
function getWeightHistory(userId) {
    return db.prepare(`
        SELECT * FROM weight_history
        WHERE user_id = ?
        ORDER BY recorded_date DESC
        LIMIT 90
    `).all(userId);
}

// ─── Helpers ─────────────────────────────────────────────────

function parseMeal(row) {
    try { row.ingredients = JSON.parse(row.ingredients || "[]"); } catch { row.ingredients = []; }
    return row;
}

module.exports = {
    addMeal, getMealsToday, getTodayTotals,
    deleteMeal, updateMeal, getMealsByDate, getMealDates,
    saveWeight, getWeightHistory
};

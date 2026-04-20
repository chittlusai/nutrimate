const { getMealsByDate, getMealDates } = require("../db/queries/nutrition");

/**
 * GET /api/records
 * Returns list of dates that have meal data + totals per date
 */
function getAllRecords(req, res) {
    try {
        const dates = getMealDates(req.user.id);
        const records = dates.map(({ date }) => {
            const meals = getMealsByDate(req.user.id, date);
            const totals = meals.reduce((acc, m) => {
                acc.calories += m.calories || 0;
                acc.protein  += m.protein  || 0;
                acc.carbs    += m.carbs    || 0;
                acc.fats     += m.fats     || 0;
                acc.fiber    += m.fiber    || 0;
                acc.sugar    += m.sugar    || 0;
                return acc;
            }, { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0, sugar: 0 });
            return { date, meals, totals };
        });
        return res.json({ records });
    } catch (err) {
        console.error("Records error:", err);
        return res.status(500).json({ error: "Failed to fetch records" });
    }
}

/**
 * GET /api/records/:date
 * date param = YYYY-MM-DD
 */
function getRecordByDate(req, res) {
    try {
        const { date } = req.params;
        const meals = getMealsByDate(req.user.id, date);
        return res.json({ date, meals });
    } catch (err) {
        console.error("Record by date error:", err);
        return res.status(500).json({ error: "Failed to fetch record" });
    }
}

module.exports = { getAllRecords, getRecordByDate };

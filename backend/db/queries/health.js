const db = require("../database");

/**
 * Get health profile for a user
 */
function getHealthProfile(userId) {
    const row = db.prepare("SELECT * FROM health_profiles WHERE user_id = ?").get(userId);
    if (!row) return null;
    // Parse JSON fields
    try { row.conditions = JSON.parse(row.conditions || "{}"); } catch { row.conditions = {}; }
    return row;
}

/**
 * Insert or replace health profile
 */
function upsertHealthProfile(userId, data) {
    const stmt = db.prepare(`
        INSERT INTO health_profiles
            (user_id, age, weight, height, height_unit, feet, inches, gender,
             bmi, bmi_status, activity_level, daily_calories, goal, conditions,
             fasting_bs, postprandial_bs, systolic_bp, diastolic_bp, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        ON CONFLICT(user_id) DO UPDATE SET
            age             = excluded.age,
            weight          = excluded.weight,
            height          = excluded.height,
            height_unit     = excluded.height_unit,
            feet            = excluded.feet,
            inches          = excluded.inches,
            gender          = excluded.gender,
            bmi             = excluded.bmi,
            bmi_status      = excluded.bmi_status,
            activity_level  = excluded.activity_level,
            daily_calories  = excluded.daily_calories,
            goal            = excluded.goal,
            conditions      = excluded.conditions,
            fasting_bs      = excluded.fasting_bs,
            postprandial_bs = excluded.postprandial_bs,
            systolic_bp     = excluded.systolic_bp,
            diastolic_bp    = excluded.diastolic_bp,
            updated_at      = datetime('now')
    `);
    stmt.run(
        userId,
        data.age, data.weight, data.height, data.heightUnit,
        data.feet || null, data.inches || null, data.gender,
        data.bmi, data.bmiStatus, data.activityLevel, data.dailyCalories, data.goal,
        JSON.stringify(data.conditions || {}),
        data.fastingBS || null, data.postprandialBS || null,
        data.systolicBP || null, data.diastolicBP || null
    );
}

module.exports = { getHealthProfile, upsertHealthProfile };

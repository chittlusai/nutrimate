const { getHealthProfile, upsertHealthProfile } = require("../db/queries/health");

/**
 * GET /api/health
 */
function getProfile(req, res) {
    try {
        const profile = getHealthProfile(req.user.id);
        return res.json({ profile: profile || null });
    } catch (err) {
        console.error("Health get error:", err);
        return res.status(500).json({ error: "Failed to load health profile" });
    }
}

/**
 * POST /api/health
 * Body: { age, weight, height, heightUnit, feet, inches, gender,
 *         activityLevel, goal, conditions, fastingBS, postprandialBS,
 *         systolicBP, diastolicBP }
 */
function saveProfile(req, res) {
    try {
        const {
            age, weight, height, heightUnit, feet, inches, gender,
            activityLevel, goal, conditions,
            fastingBS, postprandialBS, systolicBP, diastolicBP
        } = req.body;

        if (!age || !weight || !height || !gender || !activityLevel) {
            return res.status(400).json({ error: "Missing required profile fields" });
        }

        // Compute BMI
        const heightM = height / 100;
        const bmi = parseFloat((weight / (heightM * heightM)).toFixed(1));

        let bmiStatus = "Normal";
        if (bmi < 18.5) bmiStatus = "Underweight";
        else if (bmi < 25) bmiStatus = "Normal";
        else if (bmi < 30) bmiStatus = "Overweight";
        else bmiStatus = "Obese";

        // Compute BMR (Mifflin-St Jeor)
        let bmr;
        if (gender === "male") {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }

        const activityFactors = {
            sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9
        };
        const factor = activityFactors[activityLevel] || 1.2;
        let dailyCalories = Math.round(bmr * factor);

        if (goal === "weight_loss") dailyCalories -= 300;
        if (goal === "weight_gain") dailyCalories += 300;
        dailyCalories = Math.max(1200, Math.min(dailyCalories, 4000));

        upsertHealthProfile(req.user.id, {
            age, weight, height, heightUnit: heightUnit || "cm",
            feet, inches, gender, bmi, bmiStatus,
            activityLevel, dailyCalories, goal,
            conditions: conditions || {},
            fastingBS, postprandialBS, systolicBP, diastolicBP
        });

        return res.json({
            success: true,
            profile: { bmi, bmiStatus, dailyCalories }
        });
    } catch (err) {
        console.error("Health save error:", err);
        return res.status(500).json({ error: "Failed to save health profile" });
    }
}

module.exports = { getProfile, saveProfile };

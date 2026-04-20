-- ============================================================
-- Nutrimate SQLite Schema
-- ============================================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    name            TEXT    NOT NULL,
    email           TEXT    NOT NULL UNIQUE,
    password        TEXT    NOT NULL,
    is_verified     INTEGER NOT NULL DEFAULT 0,
    otp_code        TEXT,
    otp_expires_at  TEXT,
    created_at      TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Health profiles (one per user, upserted)
CREATE TABLE IF NOT EXISTS health_profiles (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id         INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    age             REAL,
    weight          REAL,
    height          REAL,
    height_unit     TEXT    DEFAULT 'cm',
    feet            TEXT,
    inches          TEXT,
    gender          TEXT,
    bmi             REAL,
    bmi_status      TEXT,
    activity_level  TEXT,
    daily_calories  INTEGER,
    goal            TEXT,
    conditions      TEXT    DEFAULT '{}',   -- JSON blob
    fasting_bs      REAL,
    postprandial_bs REAL,
    systolic_bp     REAL,
    diastolic_bp    REAL,
    updated_at      TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Meal log (each analyzed food entry)
CREATE TABLE IF NOT EXISTS meals (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    food_name       TEXT    NOT NULL,
    calories        REAL    DEFAULT 0,
    protein         REAL    DEFAULT 0,
    carbs           REAL    DEFAULT 0,
    fats            REAL    DEFAULT 0,
    fiber           REAL    DEFAULT 0,
    sugar           REAL    DEFAULT 0,
    ingredients     TEXT    DEFAULT '[]',   -- JSON array
    description     TEXT,
    quantity        REAL    DEFAULT 1,
    grams           REAL    DEFAULT 100,
    image_data      TEXT,                   -- base64 or URL
    logged_at       TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Index for fast per-user date range queries
CREATE INDEX IF NOT EXISTS idx_meals_user_date ON meals(user_id, logged_at);

-- Daily weight history
CREATE TABLE IF NOT EXISTS weight_history (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    weight_kg       REAL    NOT NULL,
    recorded_date   TEXT    NOT NULL,       -- 'YYYY-MM-DD'
    UNIQUE(user_id, recorded_date)
);

const pool = require("./db");

async function migrate() {
    try {
        await pool.query("ALTER TABLE gallery ADD COLUMN IF NOT EXISTS is_cover BOOLEAN DEFAULT FALSE;");
        console.log("Database migration successful: added is_cover column to gallery.");
        process.exit(0);
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
}
migrate();

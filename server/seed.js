const db = require("./db");
const bcrypt = require("bcrypt");

async function seedAdmin() {
    try {
        console.log("Checking for existing admin accounts in database...");
        
        // Ensure tables exist or log error if they don't
        const resAdminsTable = await db.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'admins'
            );
        `);
        
        if (!resAdminsTable.rows[0].exists) {
            console.error("CRITICAL: 'admins' table does not exist in the database. Please run database.sql first to create tables.");
            process.exit(1);
        }

        const result = await db.query("SELECT * FROM admins");
        if (result.rows.length === 0) {
            console.log("No admin accounts found. Creating default admin...");
            const hash = await bcrypt.hash("admin123", 10);
            await db.query(
                "INSERT INTO admins (username, password_hash) VALUES ($1, $2)",
                ["admin", hash]
            );
            console.log("Default admin created successfully!");
            console.log("Username: admin");
            console.log("Password: admin123");
        } else {
            console.log(`The 'admins' table already has ${result.rows.length} record(s). Seeding skipped.`);
        }
    } catch (err) {
        console.error("Error during database seeding:", err);
    } finally {
        await db.end();
        console.log("Database connection closed.");
    }
}

seedAdmin();

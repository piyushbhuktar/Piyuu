const db = require("./db");

async function createAuditionsTable() {
    try {
        console.log("Checking and creating 'auditions' table in the database...");
        
        await db.query(`
            CREATE TABLE IF NOT EXISTS auditions (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                event_date DATE,
                location VARCHAR(255),
                image_url TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        
        console.log("\x1b[32mSuccess: 'auditions' table created or already exists in the database.\x1b[0m");
    } catch (err) {
        console.error("\x1b[31mError creating 'auditions' table:\x1b[0m", err.message);
    } finally {
        await db.end();
        console.log("Database connection closed.");
    }
}

createAuditionsTable();

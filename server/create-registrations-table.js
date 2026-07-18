const db = require("./db");

async function createRegistrationsTable() {
    try {
        console.log("Checking and creating 'registrations' table in the database...");
        
        await db.query(`
            CREATE TABLE IF NOT EXISTS registrations (
                id SERIAL PRIMARY KEY,
                full_name VARCHAR(255) NOT NULL,
                age INT,
                email VARCHAR(255),
                phone VARCHAR(50) NOT NULL,
                whatsapp VARCHAR(50),
                course VARCHAR(255) NOT NULL,
                experience TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        
        console.log("\x1b[32mSuccess: 'registrations' table created or already exists in the database.\x1b[0m");
    } catch (err) {
        console.error("\x1b[31mError creating 'registrations' table:\x1b[0m", err.message);
    } finally {
        await db.end();
        console.log("Database connection closed.");
    }
}

createRegistrationsTable();

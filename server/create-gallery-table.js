const pool = require("./db");

async function createGalleryTable() {
    try {
        const queryText = `
            CREATE TABLE IF NOT EXISTS gallery (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255),
                media_url TEXT NOT NULL,
                media_type VARCHAR(50) NOT NULL, -- 'image' or 'video'
                folder VARCHAR(50) NOT NULL,     -- 'achievements' or 'performances'
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        await pool.query(queryText);
        console.log("Gallery table created successfully or already exists.");
        process.exit(0);
    } catch (err) {
        console.error("Error creating gallery table:", err);
        process.exit(1);
    }
}

createGalleryTable();

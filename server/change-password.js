const db = require("./db");
const bcrypt = require("bcrypt");

// Get password from command line arguments
const newPassword = process.argv[2];

if (!newPassword) {
    console.log("\x1b[31mError: No new password provided!\x1b[0m");
    console.log("Usage: \x1b[33mnode server/change-password.js your_new_password_here\x1b[0m");
    process.exit(1);
}

async function changePassword() {
    try {
        console.log("Generating secure hash for your new password...");
        const hash = await bcrypt.hash(newPassword, 10);
        
        console.log("Updating password in the database...");
        // Update the password for the 'admin' user
        const result = await db.query(
            "UPDATE admins SET password_hash = $1 WHERE username = $2 RETURNING username",
            [hash, "admin"]
        );
        
        if (result.rows.length === 0) {
            console.log("Warning: 'admin' user did not exist. Creating default 'admin' account...");
            await db.query(
                "INSERT INTO admins (username, password_hash) VALUES ($1, $2)",
                ["admin", hash]
            );
            console.log("\x1b[32mSuccess: Admin account created with your new password!\x1b[0m");
        } else {
            console.log("\x1b[32mSuccess: Admin password updated successfully!\x1b[0m");
        }
    } catch (err) {
        console.error("\x1b[31mDatabase error occurred:\x1b[0m", err.message);
    } finally {
        // Close database pool connection so the script exits
        await db.end();
        console.log("Database connection closed.");
    }
}

changePassword();

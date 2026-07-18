const db = require("../db");

// Get all auditions
const getAuditions = async (req, res) => {
    try {
        const result = await db.query(
            "SELECT * FROM auditions ORDER BY event_date ASC"
        );
        res.json(result.rows);
    } catch (err) {
        console.error("GET AUDITIONS ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};

// Add a new audition
const addAudition = async (req, res) => {
    try {
        const { title, description, event_date, location, image_url } = req.body;

        const result = await db.query(
            `INSERT INTO auditions(title, description, event_date, location, image_url)
             VALUES($1, $2, $3, $4, $5)
             RETURNING *`,
            [title, description, event_date, location, image_url]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("ADD AUDITION ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};

// Update an existing audition
const updateAudition = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, event_date, location, image_url } = req.body;

        const result = await db.query(
            `UPDATE auditions
             SET title = $1,
                 description = $2,
                 event_date = $3,
                 location = $4,
                 image_url = $5
             WHERE id = $6
             RETURNING *`,
            [title, description, event_date, location, image_url, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Audition not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error("UPDATE AUDITION ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};

// Delete an audition
const deleteAudition = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            "DELETE FROM auditions WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Audition not found" });
        }

        res.json({ message: "Audition deleted successfully" });
    } catch (err) {
        console.error("DELETE AUDITION ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAuditions,
    addAudition,
    updateAudition,
    deleteAudition
};

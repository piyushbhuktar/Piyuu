const db = require("../db");

// Get all performances
const getPerformances = async (req, res) => {
    try {
        const result = await db.query(
            "SELECT * FROM performances ORDER BY event_date ASC"
        );
        res.json(result.rows);
    } catch (err) {
        console.error("GET PERFORMANCES ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};

// Add a performance
const addPerformance = async (req, res) => {
    try {
        const { title, description, event_date, image_url } = req.body;

        const result = await db.query(
            `INSERT INTO performances(title, description, event_date, image_url)
             VALUES($1, $2, $3, $4)
             RETURNING *`,
            [title, description, event_date, image_url]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("ADD PERFORMANCE ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};

// Update an existing performance
const updatePerformance = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, event_date, image_url } = req.body;

        const result = await db.query(
            `UPDATE performances
             SET title = $1,
                 description = $2,
                 event_date = $3,
                 image_url = $4
             WHERE id = $5
             RETURNING *`,
            [title, description, event_date, image_url, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Performance not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error("UPDATE PERFORMANCE ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};

// Delete a performance
const deletePerformance = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            "DELETE FROM performances WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Performance not found" });
        }

        res.json({ message: "Performance deleted successfully" });
    } catch (err) {
        console.error("DELETE PERFORMANCE ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getPerformances,
    addPerformance,
    updatePerformance,
    deletePerformance
};

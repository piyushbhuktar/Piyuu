const db = require("../db");

// Get all workshops
const getWorkshops = async (req, res) => {
    try {
        const result = await db.query(
            "SELECT * FROM workshops ORDER BY event_date ASC"
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// Add workshop
const addWorkshop = async (req, res) => {
    try {
        const { title, description, event_date, image_url } = req.body;

        const result = await db.query(
            `INSERT INTO workshops(title, description, event_date, image_url)
             VALUES($1,$2,$3,$4)
             RETURNING *`,
            [title, description, event_date, image_url]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// Update workshop
const updateWorkshop = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, event_date, image_url } = req.body;

        const result = await db.query(
            `UPDATE workshops
             SET title=$1,
                 description=$2,
                 event_date=$3,
                 image_url=$4
             WHERE id=$5
             RETURNING *`,
            [title, description, event_date, image_url, id]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// Delete workshop
const deleteWorkshop = async (req, res) => {
    try {
        const { id } = req.params;

        await db.query(
            "DELETE FROM workshops WHERE id=$1",
            [id]
        );

        res.json({ message: "Workshop deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getWorkshops,
    addWorkshop,
    updateWorkshop,
    deleteWorkshop
};
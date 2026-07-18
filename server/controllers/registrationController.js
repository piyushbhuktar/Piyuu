const db = require("../db");

// Submit a new registration (Public)
const addRegistration = async (req, res) => {
    try {
        const { full_name, age, email, phone, whatsapp, course, experience } = req.body;

        if (!full_name || !phone || !course) {
            return res.status(400).json({ 
                success: false, 
                message: "Full Name, Phone, and Course fields are required." 
            });
        }

        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Phone Number. Must be a valid 10-digit mobile number."
            });
        }

        if (whatsapp && !phoneRegex.test(whatsapp)) {
            return res.status(400).json({
                success: false,
                message: "Invalid WhatsApp Number. Must be a valid 10-digit mobile number."
            });
        }

        const result = await db.query(
            `INSERT INTO registrations(full_name, age, email, phone, whatsapp, course, experience)
             VALUES($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [
                full_name, 
                age ? parseInt(age) : null, 
                email || null, 
                phone, 
                whatsapp || null, 
                course, 
                experience || null
            ]
        );

        res.status(201).json({
            success: true,
            message: "Registration submitted successfully!",
            data: result.rows[0]
        });

    } catch (err) {
        console.error("ADD REGISTRATION ERROR:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// Get all registrations (Secured - Admin Only)
const getRegistrations = async (req, res) => {
    try {
        const result = await db.query(
            "SELECT * FROM registrations ORDER BY created_at DESC"
        );
        res.json(result.rows);
    } catch (err) {
        console.error("GET REGISTRATIONS ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};

// Delete a registration by ID (Secured - Admin Only)
const deleteRegistration = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            "DELETE FROM registrations WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Registration submission not found." });
        }

        res.json({ message: "Registration deleted successfully." });
    } catch (err) {
        console.error("DELETE REGISTRATION ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    addRegistration,
    getRegistrations,
    deleteRegistration
};

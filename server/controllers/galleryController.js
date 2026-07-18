const pool = require("../db");
const fs = require("fs");
const path = require("path");

// Fetch all gallery items
exports.getGalleryItems = async (req, res) => {
    try {
        const { folder } = req.query;
        let queryText = "SELECT * FROM gallery";
        const queryParams = [];

        if (folder) {
            queryText += " WHERE folder = $1";
            queryParams.push(folder);
        }

        queryText += " ORDER BY created_at DESC";

        const result = await pool.query(queryText, queryParams);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching gallery items:", error);
        res.status(500).json({ success: false, message: "Server error while fetching gallery." });
    }
};

// Add new gallery item
exports.addGalleryItem = async (req, res) => {
    try {
        const { title, media_url, media_type, folder } = req.body;

        if (!media_url || !media_type || !folder) {
            return res.status(400).json({
                success: false,
                message: "Media URL, type, and folder categorizations are required."
            });
        }

        if (media_type !== "image" && media_type !== "video") {
            return res.status(400).json({
                success: false,
                message: "Media type must be 'image' or 'video'."
            });
        }

        if (folder !== "achievements" && folder !== "performances") {
            return res.status(400).json({
                success: false,
                message: "Folder category must be 'achievements' or 'performances'."
            });
        }

        const queryText = `
            INSERT INTO gallery (title, media_url, media_type, folder)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        const result = await pool.query(queryText, [title || null, media_url, media_type, folder]);

        res.status(201).json({
            success: true,
            message: "Media added to gallery successfully!",
            item: result.rows[0]
        });
    } catch (error) {
        console.error("Error adding gallery item:", error);
        res.status(500).json({ success: false, message: "Server error while adding gallery item." });
    }
};

// Delete gallery item
exports.deleteGalleryItem = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Fetch item first to delete local files if any
        const itemResult = await pool.query("SELECT * FROM gallery WHERE id = $1", [id]);
        if (itemResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Gallery item not found." });
        }

        const item = itemResult.rows[0];

        // 2. Check if file is stored locally in uploads/
        if (item.media_url && item.media_url.includes("/uploads/")) {
            try {
                const filename = item.media_url.split("/uploads/")[1];
                const filePath = path.join(__dirname, "../uploads", filename);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                    console.log(`Deleted local file: ${filePath}`);
                }
            } catch (fileErr) {
                console.error("Error deleting local file:", fileErr);
            }
        }

        // 3. Delete from database
        await pool.query("DELETE FROM gallery WHERE id = $1", [id]);

        res.status(200).json({ success: true, message: "Gallery item deleted successfully." });
    } catch (error) {
        console.error("Error deleting gallery item:", error);
        res.status(500).json({ success: false, message: "Server error while deleting gallery item." });
    }
};

// Set media item as cover photo for its folder
exports.makeGalleryCover = async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch item first to find its folder
        const itemResult = await pool.query("SELECT * FROM gallery WHERE id = $1", [id]);
        if (itemResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Gallery item not found." });
        }

        const item = itemResult.rows[0];

        if (item.media_type !== "image") {
            return res.status(400).json({ success: false, message: "Only images can be set as folder cover photos." });
        }

        // Reset all covers for this specific folder
        await pool.query("UPDATE gallery SET is_cover = FALSE WHERE folder = $1", [item.folder]);

        // Set this item as cover
        await pool.query("UPDATE gallery SET is_cover = TRUE WHERE id = $1", [id]);

        res.status(200).json({ success: true, message: "Folder cover photo updated successfully!" });
    } catch (error) {
        console.error("Error setting folder cover:", error);
        res.status(500).json({ success: false, message: "Server error while setting folder cover." });
    }
};

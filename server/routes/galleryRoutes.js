const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const galleryController = require("../controllers/galleryController");

// Public route to fetch gallery items
router.get("/", galleryController.getGalleryItems);

// Protected route to add media details directly
router.post("/", verifyToken, galleryController.addGalleryItem);

// Protected route to upload a media file
router.post("/upload", verifyToken, upload.single("mediaFile"), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded." });
        }

        // Construct public URL
        const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
        const fileUrl = `${protocol}://${req.headers.host}/uploads/${req.file.filename}`;

        res.status(200).json({
            success: true,
            message: "File uploaded successfully!",
            fileUrl: fileUrl,
            fileName: req.file.filename,
            fileType: req.file.mimetype.startsWith("video") ? "video" : "image"
        });
    } catch (err) {
        console.error("Upload error:", err);
        res.status(500).json({ success: false, message: "Server error during file upload." });
    }
});

// Protected route to delete gallery item
router.delete("/:id", verifyToken, galleryController.deleteGalleryItem);

// Protected route to set item as folder cover photo
router.put("/:id/make-cover", verifyToken, galleryController.makeGalleryCover);

module.exports = router;

const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");

const {
    getWorkshops,
    addWorkshop,
    updateWorkshop,
    deleteWorkshop
} = require("../controllers/workshopController");

// Public route to fetch workshops
router.get("/", getWorkshops);

// Protected routes to modify workshops (require login token)
router.post("/", verifyToken, addWorkshop);
router.put("/:id", verifyToken, updateWorkshop);
router.delete("/:id", verifyToken, deleteWorkshop);

module.exports = router;
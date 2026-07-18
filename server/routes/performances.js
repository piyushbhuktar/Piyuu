const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");

const {
    getPerformances,
    addPerformance,
    updatePerformance,
    deletePerformance
} = require("../controllers/performanceController");

// Public route to fetch performances
router.get("/", getPerformances);

// Protected routes to modify performances (require login token)
router.post("/", verifyToken, addPerformance);
router.put("/:id", verifyToken, updatePerformance);
router.delete("/:id", verifyToken, deletePerformance);

module.exports = router;

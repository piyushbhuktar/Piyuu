const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");

const {
    getAuditions,
    addAudition,
    updateAudition,
    deleteAudition
} = require("../controllers/auditionController");

// Public route to fetch auditions
router.get("/", getAuditions);

// Protected routes to modify auditions (require login token)
router.post("/", verifyToken, addAudition);
router.put("/:id", verifyToken, updateAudition);
router.delete("/:id", verifyToken, deleteAudition);

module.exports = router;

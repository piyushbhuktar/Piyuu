const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");

const {
    addRegistration,
    getRegistrations,
    deleteRegistration
} = require("../controllers/registrationController");

// Public route to submit course registration
router.post("/", addRegistration);

// Protected routes to view or delete registrations (require login token)
router.get("/", verifyToken, getRegistrations);
router.delete("/:id", verifyToken, deleteRegistration);

module.exports = router;

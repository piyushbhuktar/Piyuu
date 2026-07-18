const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Expecting "Bearer <token>"

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Access token is required. Please log in."
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Store admin ID
        next();
    } catch (err) {
        return res.status(403).json({
            success: false,
            message: "Session expired or invalid token. Please log in again."
        });
    }
};

module.exports = verifyToken;

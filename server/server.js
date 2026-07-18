const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const db = require("./db");
const authRoutes = require("./routes/authRoutes");
const workshopRoutes = require("./routes/workshopRoutes");
const performanceRoutes = require("./routes/performances");
const auditionRoutes = require("./routes/auditionRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const galleryRoutes = require("./routes/galleryRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Register API routes
app.use("/api", authRoutes);
app.use("/api/workshops", workshopRoutes);
app.use("/api/performances", performanceRoutes);
app.use("/api/auditions", auditionRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/gallery", galleryRoutes);

// Simple health check endpoint
app.get("/health", (req, res) => {
    res.json({ status: "ok", message: "Natyarang Server is running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
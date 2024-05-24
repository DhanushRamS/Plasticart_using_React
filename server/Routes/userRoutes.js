const express = require("express");
const authenticateToken = require("../middleware/auth");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/save-data", authenticateToken, userController.saveData);
router.get("/get-image/:email", userController.getImage);

// Add other user-related routes

module.exports = router;

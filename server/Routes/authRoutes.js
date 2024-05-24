const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);

// Similarly, add routes for vendor and admin registration and login

module.exports = router;

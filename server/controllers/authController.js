const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Vendor = require("../models/vendor.model");
const Admin = require("../models/admin.model");
const generateToken = require("../utils/generateToken");

exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, email, password: hashedPassword });
    res.json({ status: "ok" });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ error: "Registration failed" });
  }
};

// Similarly, implement loginUser, registerVendor, loginVendor, registerAdmin, and loginAdmin

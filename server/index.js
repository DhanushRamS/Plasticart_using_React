//MAIN BACKEND index.js

//Backend folder is from HTML CSS JS PROJECT which is not connect to a database and stores data internally

const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const haverSine = require("./services/haversine_distance");
const { sendNotification } = require("./services/email_service");
const Vendor = require("./models/vendor.model");
const multer = require("multer"); // Import multer for handling file uploads
const { v4: uuidv4 } = require("uuid"); // Import uuid for generating unique filenames

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/plasticart");
const db = mongoose.connection;
db.once("open", function () {
  console.log("connected");
});

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); // Specify the upload directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = uuidv4(); // Generate a unique filename
    cb(null, `${uniqueSuffix}-${file.originalname}`); // Combine unique filename with original filename
  },
});

const upload = multer({ storage: storage });

// Define the /upload endpoint for handling image uploads
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const { filename } = req.file; // Get the filename of the uploaded image

    // Assuming you have a User model with an image field to store filenames
    const user = await User.findOneAndUpdate(
      { email: req.user.email },
      { $set: { image: filename } }
    );

    res.json({ status: "ok", filename });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Image upload failed" });
  }
});

//User Login-----------------------------------------------------------------------------------------

app.post("/api/register", async (req, res) => {
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
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid login" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid login" });
    }

    const token = jwt.sign({ name: user.name, email: user.email }, "secret123");

    res.json({ status: "ok", user: token });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

//Vendor Login-------------------------------------------------------------------------------------------------------------------------------

app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await Vendor.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await Vendor.create({ username, email, password: hashedPassword });
    res.json({ status: "ok" });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(400).json({ error: "Invalid login" });
    }

    const isPasswordValid = await bcrypt.compare(password, vendor.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid login" });
    }

    const token = jwt.sign(
      { name: vendor.name, email: vendor.email },
      "secret123"
    );

    res.json({ status: "ok", vendor: token });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

// class Vendor {
//   constructor(username, email, password, locationX, locationY) {
//     this.username = username;
//     this.email = email;
//     this.password = password;
//     this.locationX = locationX;
//     this.locationY = locationY;
//   }
// }

function distance(vendor, userlat, userlong) {
  return haverSine(vendor.locationX, vendor.locationY, userlat, userlong);
}

// Middleware for verifying JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token, "secret123", (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
};

app.get("/api/quote", verifyToken, async (req, res) => {
  const email = req.user.email;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ status: "ok", quote: user.quote });
  } catch (err) {
    console.error("Error fetching quote:", err);
    res.status(500).json({ error: "Failed to fetch quote" });
  }
});

app.post("/api/quote", verifyToken, async (req, res) => {
  const email = req.user.email;
  const quote = req.body.quote;

  try {
    await User.updateOne({ email }, { $set: { quote } });
    res.json({ status: "ok" });
  } catch (err) {
    console.error("Error updating quote:", err);
    res.status(500).json({ error: "Failed to update quote" });
  }
});

//

const PORT = process.env.PORT || 1337;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

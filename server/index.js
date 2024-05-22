// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const multer = require("multer");
// const { v4: uuidv4 } = require("uuid");
// const fs = require("fs");
// const path = require("path");
// const User = require("./models/user.model");
// const Vendor = require("./models/vendor.model");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const http = require("http");
// const socketIo = require("socket.io");

// const app = express();

// const corsOptions = {
//   origin: "http://localhost:3000",
//   optionsSuccessStatus: 200,
// };

// app.use(cors(corsOptions));
// app.use(express.json());

// mongoose.connect("mongodb://localhost:27017/plasticart", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const db = mongoose.connection;
// db.once("open", () => {
//   console.log("connected to MongoDB");
// });

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./uploads");
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = uuidv4();
//     cb(null, uniqueSuffix + file.originalname);
//   },
// });

// const upload = multer({ storage: storage });

// // Utility functions for JWT token generation and verification
// const generateToken = (user, secret, expiresIn) => {
//   return jwt.sign(user, secret, { expiresIn });
// };

// const authenticateToken = (req, res, next) => {
//   // const token = req.header("Authorization");
//   // if (!token) return res.status(401).send("Access Denied");

//   // try {
//   //   const verified = jwt.verify(token.split(" ")[1], "secret123");
//   //   req.user = verified;
//   //   next();
//   // } catch (err) {
//   //   res.status(400).send("Invalid Token");
//   // }
//   next();
// };

// const findNearestVendor = (lat, lon, vendors) => {
//   const R = 6371; // Radius of the Earth in km

//   const toRad = (value) => (value * Math.PI) / 180;

//   let nearestVendor = null;
//   let minDistance = Infinity;

//   vendors.forEach((vendor) => {
//     const dLat = toRad(vendor.latitude - lat);
//     const dLon = toRad(vendor.longitude - lon);
//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos(toRad(lat)) *
//         Math.cos(toRad(vendor.latitude)) *
//         Math.sin(dLon / 2) *
//         Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     const distance = R * c;

//     if (distance < minDistance && distance <= 10) {
//       // Only consider vendors within 10 km
//       minDistance = distance;
//       nearestVendor = vendor;
//     }
//   });

//   return nearestVendor;
// };

// // Endpoint for long-polling
// const pendingPickups = {};

// app.get("/poll-pickups/:email", authenticateToken, (req, res) => {
//   const { email } = req.params;

//   if (!pendingPickups[email]) {
//     pendingPickups[email] = [];
//   }

//   const checkForNewPickups = () => {
//     const newPickups = pendingPickups[email];
//     if (newPickups.length > 0) {
//       res.json(newPickups);
//       pendingPickups[email] = [];
//     } else {
//       setTimeout(checkForNewPickups, 1000); // Retry every 1 second
//     }
//   };

//   checkForNewPickups();
// });

// app.post(
//   "/upload-image",
//   authenticateToken,
//   upload.single("image"),
//   async (req, res) => {
//     try {
//       const { lat, long } = req.body;
//       console.log("Received image with Lat:", lat, "Long:", long);
//       console.log(req.file);
//       res.send("Uploaded!!");
//     } catch (error) {
//       console.error("Error uploading image:", error);
//       res.status(500).json({ error: "Image upload failed" });
//     }
//   }
// );

// app.get("/get-image", async (req, res) => {
//   try {
//     const imageDir = path.join(__dirname, "uploads");
//     fs.readdir(imageDir, (err, files) => {
//       if (err) {
//         console.error("Error reading image directory:", err);
//         return res.status(500).json({ error: "Failed to fetch images" });
//       }

//       const imagePaths = files.map((file) => ({
//         filename: file,
//         url: `http://localhost:5000/uploads/${file}`,
//       }));

//       res.json({ status: "ok", data: imagePaths });
//     });
//   } catch (error) {
//     console.error("Error fetching images:", error);
//     res.status(500).json({ error: "Failed to fetch images" });
//   }
// });

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// app.post("/save-data", async (req, res) => {
//   try {
//     const {
//       email,
//       image,
//       prediction,
//       lat,
//       long,
//       date,
//       points,
//       description,
//       quantity,
//     } = req.body;

//     console.log("Save data ---------------->");

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Initialize trash_data array if it does not exist
//     if (!user.trash_data) {
//       user.trash_data = [];
//     }

//     user.trash_data.push({
//       image: image,
//       prediction: prediction,
//       lat: lat,
//       long: long,
//       date: date || new Date(),
//       points: points || 0,
//       description: description,
//       quantity: quantity,
//     });

//     await user.save();

//     const vendors = await Vendor.find({});
//     const nearestVendor = findNearestVendor(lat, long, vendors);
//     console.log("Nearest vendor:", nearestVendor);

//     if (!nearestVendor) {
//       return res
//         .status(404)
//         .json({ error: "No vendors available within 10 kilometers" });
//     }

//     // Create a pickup and add it to the nearest vendor's pickups
//     const pickup = {
//       image: image,
//       prediction: prediction,
//       latitude: lat,
//       longitude: long,
//       status: "pending",
//       description: description,
//       quantity: quantity,
//     };

//     nearestVendor.pickups.push(pickup);
//     await nearestVendor.save();

//     // Notify the vendor
//     if (!pendingPickups[nearestVendor.email]) {
//       pendingPickups[nearestVendor.email] = [];
//     }
//     pendingPickups[nearestVendor.email].push(pickup);

//     // Emit the event to notify the nearest vendor
//     io.to(nearestVendor.email).emit("notification", { pickup });

//     res.json({ status: "ok", pickup });
//   } catch (error) {
//     console.log(error);
//     console.error("Error saving data:", error);
//     res.status(500).json({ error: "Failed to save data" });
//   }
// });

// // User registration
// app.post("/api/user/register", async (req, res) => {
//   const { username, email, password } = req.body;

//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: "Email already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     await User.create({ username, email, password: hashedPassword });
//     res.json({ status: "ok" });
//   } catch (err) {
//     console.error("Error registering user:", err);
//     res.status(500).json({ error: "Registration failed" });
//   }
// });

// // User login
// app.post("/api/user/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ error: "Invalid login" });
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(400).json({ error: "Invalid login" });
//     }

//     const token = generateToken(
//       { email: user.email, username: user.username, role: "user" },
//       "secret123",
//       "1h"
//     );

//     res.json({
//       status: "ok",
//       token,
//       email: user.email,
//       username: user.username,
//     });
//   } catch (err) {
//     console.error("Error logging in:", err);
//     res.status(500).json({ error: "Login failed" });
//   }
// });

// // Vendor registration
// app.post("/api/vendor/register", async (req, res) => {
//   console.log(req.body);
//   const { username, email, password } = req.body;

//   try {
//     const existingVendor = await Vendor.findOne({ email });
//     if (existingVendor) {
//       return res.status(400).json({ error: "Email already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     await Vendor.create({ username, email, password: hashedPassword });
//     res.json({ status: "ok" });
//   } catch (err) {
//     console.error("Error registering vendor:", err);
//     res.status(500).json({ error: "Registration failed" });
//   }
// });

// // Vendor login
// app.post("/api/vendor/login", async (req, res) => {
//   const { email, password, latitude, longitude } = req.body;

//   try {
//     const vendor = await Vendor.findOne({ email });

//     if (!vendor) {
//       return res.status(400).json({ error: "Invalid login" });
//     }

//     const isPasswordValid = await bcrypt.compare(password, vendor.password);
//     if (!isPasswordValid) {
//       return res.status(400).json({ error: "Invalid login" });
//     }

//     // Update vendor location
//     vendor.latitude = latitude;
//     vendor.longitude = longitude;
//     await vendor.save();

//     const token = generateToken(
//       { email: vendor.email, username: vendor.username, role: "vendor" },
//       "secret123",
//       "1h"
//     );

//     res.json({
//       status: "ok",
//       token,
//       email: vendor.email,
//       username: vendor.username,
//     });
//   } catch (err) {
//     console.error("Error logging in:", err);
//     res.status(500).json({ error: "Login failed" });
//   }
// });

// app.get("/vendor/test", (req, res) => {
//   res.send("Hello World!");
// });

// app.get(
//   "/vendor/:email/rejected-pickups",
//   authenticateToken,
//   async (req, res) => {
//     const { email } = req.params;

//     try {
//       const vendor = await Vendor.findOne({ email }).populate("pickups");
//       const rejectedPickups = vendor.pickups.filter(
//         (pickup) => pickup.status === "rejected"
//       );

//       res.json(rejectedPickups);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   }
// );

// app.post(
//   "/vendor/:email/pickups/:pickupId/accept",
//   authenticateToken,
//   async (req, res) => {
//     const { email, pickupId } = req.params;

//     try {
//       const vendor = await Vendor.findOne({ email });
//       const pickup = vendor.pickups.id(pickupId);
//       if (pickup) {
//         pickup.status = "accepted";
//         await vendor.save();
//         res.json(pickup);
//       } else {
//         res.status(404).json({ error: "Pickup not found" });
//       }
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   }
// );

// // /vendor/${email}/pickups

// app.get("/vendor/:email", async (req, res) => {
//   try {
//     const { email } = req.params;
//     console.log(email);
//     let vendor = await Vendor.findOne({ email: email });
//     console.log(Vendor);

//     return res.json(vendor.pickups);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: err.message });
//   }
// });

// app.post(
//   "/vendor/:email/pickups/:pickupId/reject",
//   async (req, res) => {
//     const { email, pickupId } = req.params;

//     try {
//       const vendor = await Vendor.findOne({ email: email });
//       const pickup = vendor.pickups.id(pickupId);
//       if (pickup) {
//         pickup.status = "rejected";
//         await vendor.save();
//         res.json(pickup);
//       } else {
//         res.status(404).json({ error: "Pickup not found" });
//       }
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   }
// );

// // Middleware to serve static files (if needed)
// app.use(express.static("public"));

// // Define a route for the homepage
// // app.get("/", (req, res) => {
// //   res.sendFile(__dirname + "/index.html");
// // });

// // // Socket.IO connection handler
// // // io.on("connection", (socket) => {
// // //   console.log("A user connected");

// // //   // Function to send notification
// // //   const sendNotification = (message, userId) => {
// // //     // Emitting to a specific channel
// // //     socket.to("notify-channel").emit("notification", { message, userId });
// // //   };

// // //   // Example of receiving a message and userId to broadcast
// // //   socket.on("sendNotification", (data) => {
// // //     sendNotification(data.message, data.userId);
// // //   });

// // //   // Joining a specific channel
// // //   socket.on("joinChannel", (channel) => {
// // //     socket.join(channel);
// // //     console.log(`User joined channel: ${channel}`);
// // //   });

// //   // Disconnect event
// //   socket.on("disconnect", () => {
// // console.log("User disconnected");
// //   });
// // });

// app.get("/api/vendor/me", authenticateToken, async (req, res) => {
//   try {
//     const vendor = await Vendor.findOne({ email: req.user.email });
//     if (!vendor) {
//       return res.status(404).json({ error: "Vendor not found" });
//     }
//     res.json(vendor);
//   } catch (err) {
//     console.error("Error fetching vendor data:", err);
//     res.status(500).json({ error: "Failed to fetch vendor data" });
//   }
// });

// app.post("/api/vendor/update-location", (req, res) => {
//   const { email, latitude, longitude } = req.body;

//   Vendor.updateOne({ email }, { $set: { latitude, longitude } })
//     .then((result) => {
//       res.status(200).json({ message: "Location updated successfully" });
//     })
//     .catch((error) => {
//       res.status(500).json({ message: "Error updating location", error });
//     });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server started on port ${PORT}`);
// });

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");
const User = require("./models/user.model");
const Vendor = require("./models/vendor.model");
const Admin = require("./models/admin.model");
const CompletedPickup = require("./models/completedPickup.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/plasticart", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once("open", () => {
  console.log("connected to MongoDB");
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = uuidv4();
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage: storage });

const generateToken = (user, secret, expiresIn) => {
  return jwt.sign(user, secret, { expiresIn });
};

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).send("Access Denied");

  try {
    const verified = jwt.verify(token.split(" ")[1], "secret123");
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};

const findNearestVendor = (lat, lon, vendors) => {
  const R = 6371;
  const toRad = (value) => (value * Math.PI) / 180;

  let nearestVendor = null;
  let minDistance = Infinity;

  vendors.forEach((vendor) => {
    const dLat = toRad(vendor.latitude - lat);
    const dLon = toRad(vendor.longitude - lon);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat)) *
        Math.cos(toRad(vendor.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    if (distance < minDistance && distance <= 10) {
      minDistance = distance;
      nearestVendor = vendor;
    }
  });

  return nearestVendor;
};

// Endpoint for long-polling
const pendingPickups = {};

app.get("/poll-pickups/:email", authenticateToken, (req, res) => {
  const { email } = req.params;

  if (!pendingPickups[email]) {
    pendingPickups[email] = [];
  }

  const checkForNewPickups = () => {
    const newPickups = pendingPickups[email];
    if (newPickups.length > 0) {
      res.json(newPickups);
      pendingPickups[email] = [];
    } else {
      setTimeout(checkForNewPickups, 1000);
    }
  };

  checkForNewPickups();
});

app.post(
  "/upload-image",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    try {
      const { lat, long, email, description, quantity } = req.body;
      const image = req.file.filename;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const vendors = await Vendor.find({});
      const nearestVendor = findNearestVendor(lat, long, vendors);

      if (!nearestVendor) {
        return res
          .status(404)
          .json({ error: "No vendors available within 10 kilometers" });
      }

      const pickup = {
        image,
        prediction: req.body.prediction,
        latitude: lat,
        longitude: long,
        description,
        quantity,
        userEmail: email,
      };

      nearestVendor.pickups.push(pickup);
      await nearestVendor.save();

      if (!pendingPickups[nearestVendor.email]) {
        pendingPickups[nearestVendor.email] = [];
      }
      pendingPickups[nearestVendor.email].push(pickup);

      res.json({ status: "ok", pickup });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ error: "Image upload failed" });
    }
  }
);

app.get("/get-image/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ status: "ok", data: user.trash_data });
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ error: "Failed to fetch images" });
  }
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.post("/save-data", async (req, res) => {
  try {
    const {
      email,
      image,
      prediction,
      lat,
      long,
      date,
      points,
      description,
      quantity,
    } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.trash_data) {
      user.trash_data = [];
    }

    user.trash_data.push({
      image: image,
      prediction: prediction,
      lat: lat,
      long: long,
      date: date || new Date(),
      points: points || 0,
      description: description,
      quantity: quantity,
    });

    await user.save();

    const vendors = await Vendor.find({});
    const nearestVendor = findNearestVendor(lat, long, vendors);

    if (!nearestVendor) {
      return res
        .status(404)
        .json({ error: "No vendors available within 10 kilometers" });
    }

    const pickup = {
      image: image,
      prediction: prediction,
      latitude: lat,
      longitude: long,
      status: "pending",
      description: description,
      quantity: quantity,
      userEmail: email,
    };

    nearestVendor.pickups.push(pickup);
    await nearestVendor.save();

    if (!pendingPickups[nearestVendor.email]) {
      pendingPickups[nearestVendor.email] = [];
    }
    pendingPickups[nearestVendor.email].push(pickup);

    res.json({ status: "ok", pickup });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ error: "Failed to save data" });
  }
});

app.post(
  "/vendor/:email/pickups/:pickupId/complete",
  authenticateToken,
  async (req, res) => {
    const { email, pickupId } = req.params;
    const {
      userEmail,
      image,
      prediction,
      latitude,
      longitude,
      description,
      quantity,
    } = req.body;

    try {
      const vendor = await Vendor.findOne({ email });

      if (!vendor) {
        return res.status(404).json({ error: "Vendor not found" });
      }

      const pickup = vendor.pickups.id(pickupId);

      if (!pickup) {
        return res.status(404).json({ error: "Pickup not found" });
      }

      pickup.status = "completed";

      await vendor.save();

      const completedPickup = new CompletedPickup({
        image,
        prediction,
        latitude,
        longitude,
        description,
        quantity,
        vendorEmail: email,
        userEmail,
      });

      await completedPickup.save();

      if (!pendingPickups["admin"]) {
        pendingPickups["admin"] = [];
      }
      pendingPickups["admin"].push(completedPickup);

      res.json(completedPickup);
    } catch (error) {
      console.error("Error completing pickup:", error);
      res.status(500).json({ error: "Failed to complete pickup" });
    }
  }
);

app.post("/api/user/register", async (req, res) => {
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

app.post("/api/user/login", async (req, res) => {
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

    const token = generateToken(
      { email: user.email, username: user.username, role: "user" },
      "secret123",
      "1h"
    );

    res.json({
      status: "ok",
      token,
      email: user.email,
      username: user.username,
    });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

app.post("/api/vendor/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await Vendor.create({ username, email, password: hashedPassword });
    res.json({ status: "ok" });
  } catch (err) {
    console.error("Error registering vendor:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/api/vendor/login", async (req, res) => {
  const { email, password, latitude, longitude } = req.body;

  try {
    const vendor = await Vendor.findOne({ email });

    if (!vendor) {
      return res.status(400).json({ error: "Invalid login" });
    }

    const isPasswordValid = await bcrypt.compare(password, vendor.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid login" });
    }

    vendor.latitude = latitude;
    vendor.longitude = longitude;
    await vendor.save();

    const token = generateToken(
      { email: vendor.email, username: vendor.username, role: "vendor" },
      "secret123",
      "1h"
    );

    res.json({
      status: "ok",
      token,
      email: vendor.email,
      username: vendor.username,
    });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

app.post("/api/admin/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await Admin.create({ username, email, password: hashedPassword });
    res.json({ status: "ok" });
  } catch (err) {
    console.error("Error registering admin:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ error: "Invalid login" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid login" });
    }

    const token = generateToken(
      { email: admin.email, username: admin.username, role: "admin" },
      "secret123",
      "1h"
    );

    res.json({
      status: "ok",
      token,
      email: admin.email,
      username: admin.username,
    });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

app.get("/admin/completed-pickups", authenticateToken, async (req, res) => {
  try {
    const completedPickups = await CompletedPickup.find();
    res.json(completedPickups);
  } catch (error) {
    console.error("Error fetching completed pickups:", error);
    res.status(500).json({ error: "Failed to fetch completed pickups" });
  }
});

app.post("/admin/assign-points", authenticateToken, async (req, res) => {
  const { pickupId, points } = req.body;

  try {
    const completedPickup = await CompletedPickup.findById(pickupId);

    if (!completedPickup) {
      return res.status(404).json({ error: "Completed pickup not found" });
    }

    const user = await User.findOne({ email: completedPickup.userEmail });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.points = (user.points || 0) + points;
    await user.save();

    res.json({ status: "ok", pointsAssigned: points });
  } catch (error) {
    console.error("Error assigning points:", error);
    res.status(500).json({ error: "Failed to assign points" });
  }
});

app.get("/vendor/:email", async (req, res) => {
  try {
    const { email } = req.params;
    let vendor = await Vendor.findOne({ email: email });

    return res.json(vendor.pickups);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/vendor/me", authenticateToken, async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ email: req.user.email });
    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }
    res.json(vendor);
  } catch (err) {
    console.error("Error fetching vendor data:", err);
    res.status(500).json({ error: "Failed to fetch vendor data" });
  }
});

app.post("/api/vendor/update-location", (req, res) => {
  const { email, latitude, longitude } = req.body;

  Vendor.updateOne({ email }, { $set: { latitude, longitude } })
    .then((result) => {
      res.status(200).json({ message: "Location updated successfully" });
    })
    .catch((error) => {
      res.status(500).json({ message: "Error updating location", error });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

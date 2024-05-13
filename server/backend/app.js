const express = require("express");
const haverSine = require("./services/haversine_distance");
const { sendNotification } = require("./services/email_service");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user.model");
const jwt = require("jsonwebtoken");

app = express();

app.use(cors());

app.use(express.json());

mongoose.connect("mongodb://localhost:27017/plasticart");

const port = 9999;

let users = [];
let vendors = [];
let logged_in_vendors = [];
let logged_in_users = [];

app.get("/", (req, res) => {
  return res.send("backend root");
});

class User {
  constructor(username, email, password) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.points = 0;
  }

  increasePoints(num) {
    this.points += num;
  }

  decreasePoints(num) {
    this.points += num;
  }
}

class Vendor {
  constructor(username, email, password, locationX, locationY) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.locationX = locationX;
    this.locationY = locationY;
  }
}

function distance(vendor, userlat, userlong) {
  return haverSine(vendor.locationX, vendor.locationY, userlat, userlong);
}

app.post("/register", async (req, res) => {
  console.log(req.body);
  console.log(users);
  try {
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    res.json({ status: "ok" });
    console.log("Register")
  } catch (err) {
    res.json({ status: "error", error: "Duplicate email" });
  }
  if (
    req.body == undefined ||
    req.body.username == undefined ||
    req.body.email == undefined ||
    req.body.password == undefined
  ) {
    return res.status(400).send("Please fill in all fields");
  }

  if (
    users.filter((user) => user.username == req.body.username).length > 0 ||
    users.filter((user) => user.email == req.body.email).length > 0
  ) {
    console.log("duplicate");
    return res.status(400).send("duplicate credentials");
  }

  let user = new User(req.body.username, req.body.email, req.body.password);
  users.push(user);

  return res.send("Sucessfully registered");
});

app.post("/vendor/register", (req, res) => {
  console.log(req.body);
  if (
    req.body == undefined ||
    req.body.username == undefined ||
    req.body.email == undefined ||
    req.body.lat == undefined ||
    req.body.long == undefined ||
    req.body.password == undefined
  ) {
    return res.status(400).send("Please fill in all fields");
  }

  if (
    vendors.filter((user) => user.username == req.body.username).length > 0 ||
    vendors.filter((user) => user.email == req.body.email).length > 0
  ) {
    return res.status(400).send("duplicate credentials");
  }

  let vendor = new Vendor(
    req.body.username,
    req.body.email,
    req.body.password,
    req.body.lat,
    req.body.long
  );
  vendors.push(vendor);
  console.log(vendors);

  return res.send("Sucessfully registered");
});

app.post("/login", async (req, res) => {
  console.log(req.body.email);
  console.log(logged_in_users);
  console.log(users);

  const user = await User.findOne({
    email: req.body.email,
    password: req.body.password,
  });

  if (user) {
    const token = jwt.sign(
      {
        username: user.name,
        email: user.email,
        password: user.password,
      },
      "secret123"
    );
    return res.json({ status: "ok" });
  } else {
    return res.json({ status: "error", error: "Duplicate email" });
  }

  // let user = users.find((user) => user.email == req.body.email);

  //   if (user == undefined) {
  //     return res.status(404).send("User not found");
  //   } else if (user.password != req.body.password) {
  //     console.log("incorrect password");
  //     return res.status(400).send("Incorrect password");
  //   }
  //   if (logged_in_users.indexOf(req.body.username) >= 0) {
  //     return res.json({
  //       points: user.points,
  //       username: user.username,
  //       email: user.email,
  //     });
  //   }
  //   logged_in_users.push(user.username);
  //   return res.json({
  //     points: user.points,
  //     username: user.username,
  //     email: user.email,
  //   });
});

app.post("/vendor/login", (req, res) => {
  console.log(req.body.email);
  console.log(logged_in_vendors);
  console.log(vendors);
  let vendor = vendors.find((user) => user.email == req.body.email);

  if (vendor == undefined) {
    console.log("user not found");
    return res.status(404).send("User not found");
  } else if (vendor.password != req.body.password) {
    console.log("incorrect password");
    return res.status(400).send("Incorrect password");
  }
  if (logged_in_vendors.indexOf(req.body.username) >= 0) {
    return res.json({
      lat: vendor.locationX,
      long: vendor.locationY,
      username: vendor.username,
      email: vendor.email,
    });
  }
  logged_in_vendors.push(vendor.username);
  return res.json({
    points: vendor.points,
    username: vendor.username,
    email: vendor.email,
  });
});

function authenticate(req, res, next) {
  if (logged_in_vendors.indexOf(req.body.username) >= 0) {
    next();
  } else {
    return res.status(400).send("Unauthorised access");
  }
}

app.post("/send_trash", async (req, res) => {
  console.log(req.body);
  if (vendors.length == 0) {
    return res.send("No vendor currently available");
  }

  let nearestVendor = vendors.reduce((nearestVendor, vendor) => {
    return distance(nearestVendor, req.body.lat, req.body.long) >
      distance(vendor, req.body.lat, req.body.long)
      ? vendor
      : nearestVendor;
  }, vendors[0]);
  console.log(nearestVendor);

  message = `Trash Available at latitude : ${req.body.lat} ; longitude : ${req.body.long}\ntype: ${req.body.type}`;

  // await sendNotification({ body: message, email: nearestVendor.email });

  console.log("trash sent to :", nearestVendor);

  return res.send("Vendor dispathced to your location");
});

connection = app.listen(port, () => {
  console.log(`Plasticart app listening on port ${port}`);
});

connection.on("connection", () => {
  console.log("new connection");
});

const User = require("../models/user.model");
const Vendor = require("../models/vendor.model");
const findNearestVendor = require("../utils/findNearestVendor");

exports.saveData = async (req, res) => {
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

    res.json({ status: "ok", pickup });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ error: "Failed to save data" });
  }
};

// Similarly, implement getImage and other user-related methods

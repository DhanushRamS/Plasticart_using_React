const Vendor = require("../models/vendor.model");
const CompletedPickup = require("../models/completedPickup.model");
const findNearestVendor = require("../utils/findNearestVendor");

exports.updateLocation = async (req, res) => {
  const { email, latitude, longitude } = req.body;

  try {
    await Vendor.updateOne({ email }, { $set: { latitude, longitude } });
    res.status(200).json({ message: "Location updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating location", error });
  }
};

exports.getVendor = async (req, res) => {
  try {
    const { email } = req.params;
    let vendor = await Vendor.findOne({ email });

    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    return res.json(vendor.pickups);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getMe = async (req, res) => {
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
};

exports.completePickup = async (req, res) => {
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

    res.json(completedPickup);
  } catch (error) {
    console.error("Error completing pickup:", error);
    res.status(500).json({ error: "Failed to complete pickup" });
  }
};

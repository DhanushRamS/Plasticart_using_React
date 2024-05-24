const Admin = require("../models/admin.model");
const User = require("../models/user.model");
const CompletedPickup = require("../models/completedPickup.model");

exports.getCompletedPickups = async (req, res) => {
  try {
    const completedPickups = await CompletedPickup.find();
    res.json(completedPickups);
  } catch (error) {
    console.error("Error fetching completed pickups:", error);
    res.status(500).json({ error: "Failed to fetch completed pickups" });
  }
};

exports.assignPoints = async (req, res) => {
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
};

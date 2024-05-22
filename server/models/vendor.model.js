const mongoose = require("mongoose");

const pickupSchema = new mongoose.Schema({
  image: String,
  prediction: String,
  latitude: Number,
  longitude: Number,
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    required: true,
  },
  description: { type: String, default: "" },
  quantity: { type: Number, default: 1 },
});

const VendorSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    latitude: { type: Number, required: false },
    longitude: { type: Number, required: false },
    pickups: [pickupSchema],
  },
  { collection: "vendor-data" }
);

const Vendor = mongoose.model("VendorData", VendorSchema);

module.exports = Vendor;

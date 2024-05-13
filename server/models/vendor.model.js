const mongoose = require("mongoose");

const VendorSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    locationX: { type: String, required: true },
    locationY: { type: String, required: true },
  },
  { collection: "vendor-data" }
);

const model = mongoose.model("VendorData", VendorSchema);

module.exports = VendorModel;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const completedPickupSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  image: { type: String, required: true },
  prediction: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

const CompletedPickup = mongoose.model(
  "CompletedPickup",
  completedPickupSchema
);
module.exports = CompletedPickup;

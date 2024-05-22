const mongoose = require('mongoose');

const trashDataSchema = new mongoose.Schema({
  image: String,
  prediction: String,
  lat: Number,
  long: Number,
  date: { type: Date, default: Date.now },
  points: { type: Number, default: 0 },
  description: { type: String, default: "" },
  quantity: { type: Number, default: 1 },
});

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    trash_data: [trashDataSchema],
  },
  { collection: "user-data" }
);

const UserModel = mongoose.model("UserData", UserSchema);

module.exports = UserModel;

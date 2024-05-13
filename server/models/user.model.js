const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    trash_data: [
      {
        prediction: { type: String, required: true },
        lat: { type: String, required: true },
        long: { type: String, required: true },
        date: { type: Date, default: Date.now },
        points: { type: Number, default: 0 },
      },
    ],
    images: [String], // Array of image URLs or file paths
  },
  { collection: "user-data" }
);

const UserModel = mongoose.model("UserData", UserSchema);

module.exports = UserModel;

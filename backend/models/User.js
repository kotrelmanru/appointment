const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const UserSchema = new mongoose.Schema(
  {
    // UUID sebagai ID unik
    id: {
      type: String,
      default: uuidv4,
      unique: true,
      index: true,
    },

    _id: {
      type: String,
      default: uuidv4,
    },

    // Nama lengkap user
    name: {
      type: String,
      required: true,
    },

    // Username unik
    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // Preferred timezone
    preferred_timezone: {
      type: String,
      default: "UTC",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
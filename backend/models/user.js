const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      // required:true,
    },
    phone: {
      type: String,
      // required:true,
    },
    role: {
      type: String,
      default: "customer",
      enum: ["customer", "admin", "superadmin"],
    },
  },

  { timestamps: true }
);

const user = mongoose.model("User", userSchema);
module.exports = user;

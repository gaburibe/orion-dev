const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    name: String,
    email: String,
    password: String,
    phone: String,
    Adress1: String,
    Adress2: String,
    credit: Number,
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ]
  })
);

module.exports = User;
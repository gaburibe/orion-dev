const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    name: String,
    email: String,
    cp: String,
    password: String,
    phone: String,
    calle: String,
    noext: String,
    noint: String,
    colonia: String,
    delegacion: String,
    ciudad: String,
    mercado: String,
    zona: String,
    indicaciones: String,
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
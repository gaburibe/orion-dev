const db = require("../models");
const User = db.user;
const Role = db.role;


exports.userinfo = (req, res) => {
  orionuser = req.headers["orionuser"];
  console.log("orionuser");
	User.findOne({
    username: orionuser
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "Usuario no encontrado" });
      }

      

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      console.log("gg",user)
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        cp: user.cp,
        phone: user.phone,
        calle: user.calle,
        noext: user.noext,
        noint: user.noint,
        colonia: user.colonia,
        delegacion: user.delegacion,
        ciudad: user.ciudad,
        mercado: user.mercado,
        zona: user.zona,
        indicaciones: user.indicaciones,
        credit: user.credit,
        name:    user.name
      });
    });
  //res.status(200).send("Public Content.");
};
// exports.userinfo = (req, res) => {
//   res.status(200).send("user info.");
// };

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};
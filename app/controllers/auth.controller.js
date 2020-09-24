const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
    cp: req.body.cp,
    phone: req.body.phone,
    calle: req.body.calle,
    noext: req.body.noext,
    noint: req.body.noint,
    colonia: req.body.colonia,
    delegacion: req.body.delegacion,
    ciudad: req.body.ciudad,
    mercado: req.body.mercado,
    zona: req.body.zona,
    indicaciones: req.body.indicaciones,
    credit: 0,
    password: bcrypt.hashSync(req.body.password, 8)
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles }
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map(role => role._id);
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: "Usuario registrado exitosamente" });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "Usuario registrado exitosamente" });
        });
      });
    }
  });
};

exports.signin = (req, res) => {

  User.findOne({
    email: req.body.email
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "Email no encontrado." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Password inválido"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 70*86400 // 24 hours
      });

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
        name:    user.name,
        roles: authorities,
        accessToken: token
      });
    });
};
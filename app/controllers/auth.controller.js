const config = require("../config/config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../models");
//const { noExtendLeft } = require("sequelize/types/lib/operators");
const User = db.user;
const Op = db.Op;

exports.signup = async (req, res, next) => {
  console.log("hello");
  // Save user to database
  var user = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  });
  console.log(user); 
  return res.status(200).send({
    username: user.username
  });
  next();
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      let token = jwt.sign({ id: user.id }, config.auth.secret, {
        expiresIn: 86400 // 24 hours
      });
  
      res.status(200).send({
        id: user.id,
        username: user.username,
        email: user.email,
        accessToken: token
      });
      
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

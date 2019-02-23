const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const MongoClient = require("mongodb").MongoClient;

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
var db;
const url = "mongodb+srv://AB:Jimmyandabasiama1@cluster0-qqrwt.mongodb.net/DatabaseTest";

// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {

  if (err) {
    console.error(err);
  } else {
    db = client.db("DatabaseTest");
  }
});
  //var err
  //if (err) {
    //console.error(err);
  //} else {
   
 // }
// Load User model
//const User = require("../../models/User");
// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  // Form validation
const { errors, isValid } = validateRegisterInput(req.body);
// Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
db.collection("CollectionTest").findOne({ email: req.body.email }).then(function(user) {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } 
/*const newUser = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      };*/
// Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
          if (err) throw err;
          console.log(req.body)
          db.collection("CollectionTest").insert({ name: req.body.name, email: req.body.email, password: hash})
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    });
  });

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  // Form validation
const { errors, isValid } = validateLoginInput(req.body);
// Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
const email = req.body.email;
  const password = req.body.password;
// Find user by email
  db.collection("CollectionTest").findOne({ email: email }).then(function(user) {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }
// Check password
    bcrypt.compare(password, user.password).then(function(isMatch) {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name
        };
// Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});




module.exports=router;
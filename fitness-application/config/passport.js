const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
//const mongoose = require("mongoose");
//const User = mongoose.model("users");
const keys = require("../config/keys");
const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;
module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      db.collection("CollectionTest").find({_id :jwt_payload.id}).then(function(user){
          if(err) throw err;
            console.log("made it through passport function");
          if (user) {
            return done(null, user);
          }
          return done(null, false);
          //db.close();
        })
        .catch(err => console.log(err));
    })
  );
};
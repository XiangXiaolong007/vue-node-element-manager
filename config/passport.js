const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require("mongoose");
const key = require("./keys");
const User = mongoose.model("users");
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = key.secretOrKey;
module.exports = passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        // console.log(jwt_payload)
        User.findById(jwt_payload.id).then(user => {
            if(user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        }).catch(err => {
            console.log(err)
        })
    }))
}
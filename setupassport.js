'use strict';
const passport = require("passport");
const User = require("./models/user");
const LocalStrategy = require("passport-local").Strategy;
module.exports = function() {
 passport.serializeUser(function(user, done) {
 done(null, user._id);
 });
 passport.deserializeUser(function(id, done) {
 User.findById(id, function(err, user) {
 done(err, user);
 });
 });
};
//local
passport.use("login", new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    // passReqToCallback:true
},
    function(email, password, done) {
 User.findOne({ email: email }, function(err, user) {
 if (err) { return done(err); }
 if (!user) {
 return done(null, false,
 { message: "No user has that username!" });
 }
 user.checkPassword(password, function(err, isMatch) {
 if (err) { return done(err); }
 if (isMatch) {
 return done(null, user);
 } else {
 return done(null, false,
 { message: "Invalid password." });
 }
 });
 });
}));


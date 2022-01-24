var LocalStrategy   = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var User = require('../models/user');

// expose this function to our app using module.exports
module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });

    passport.use(new LocalStrategy({
        usernameField: 'email'
    }, (email, password, done) => {
          User.findOne({ email: email })
              .then(user => {
                if (!user) {
                    console.log('user not exist')
                    return done(null, false, { message: "Incorrect username" });
                }
                bcrypt.compare(password, user.password, (err, res) => {
                    if (err) throw err;
                    if (res) {
                        return done(null, user)
                    } else {
                        console.log('wrong pass')
                        return done(null, false, { message: "Incorrect password" })
                    }
                });
              })
              .catch(err => console.log(err))
          })
    );
};
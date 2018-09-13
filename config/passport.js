
module.exports = function (dbUser, passport) {
  const pp = passport = (passport||require("passport"));
  const User = (dbUser||require("./models").User);
  const LocalStrategy = require("passport-local").Strategy;
  const failure = {
    message: 'Sorry, something appears to have gone wrong on our end.'+
    ' Please try again later.'
  }
  //form field name settings, set the same for both login and sign up
  //be sure to change these if yours doesn't match both forms
  const options = {
    usernameField: "email", 
    passwordField: "password",
    passReqToCallback: true
  };
  const getDbUserByEmail = email => User.findOne({where:{email: email}})
  // user search for deserialization
  const dsFindUserByID = (id, done) => {
    User.findById(id).then(function (user) {
        if (user) {
            done(null, user.get());
        } else {
            done(user, null);
        }
    }).catch(err => {
      //db error failed search
      console.log("Database Error:", err);
      return done(null, null);
    });
  }

//////////Sign up//////////////////////////
  const enrollment = (req, email, password, done) => {
    getDbUserByEmail(email).then(user => {
      if (user) {
          failure.message = 'That email is already assciated with an account'
          return done(null, false, failure);
      } else {
        User.create({
          email:email,
          password:password,
          last_login:Date.now(),
          firstname:req.body.firstname,
          lastname:req.body.lastname,
          displayname: req.body.displayname,
        }).then(
          (newUser, created) => done(null,(newUser||false))).catch(err => {
            //db error failed to write new user
            console.log("Error:", err);
            return done(null, false, failure);
          }
        );
      };
    }).catch(err => {
      //db error failed search
      console.log("Database Error:", err);
      return done(null, false, failure);
    });
  };
//////////Sign On//////////////////////////
  const signon = (req, email, password, done) => {
    getDbUserByEmail(email).then(user => {
      if (!user || !user.validPassword(password)) {
        failure.message = "Invalid cedentials provided" 
        return done(null, false, failure);
      } else {
        user.setLastLogin();
        return done(null, user);
      }
    }).catch(err => {
      //db error failed search
      console.log("Database Error:", err);
      return done(null, false, failure);
    });
  };
  
  //configuration of passport strategies 
  //and housekeeping protocols
  passport.use('local-login',  new LocalStrategy(options,signon));
  passport.use('local-signup', new LocalStrategy(options,enrollment));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(dsFindUserByID);   
  return pp;
}
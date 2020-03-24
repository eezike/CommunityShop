const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGO_URL

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

const User = mongoose.model('User', userSchema);

const passportFunction = function(passport){
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, function(email, password, done){
      //Match user
      User.findOne({ email: email })
      .then(function(user){

        if(!user){
          return done(null, false, {message: "email is not registered"})
        }

        //match password
        bcrypt.compare(password, user.password, function(err, isMatch){
          if (err) throw err;

          if(isMatch){
            return done(null, user)
          } else {
            return done(null, false, {message: "password is not correct"})
          }
        });

      })
      .catch((err) => console.log(err))

    })
  );

 passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}

module.exports = { User, client, passportFunction }
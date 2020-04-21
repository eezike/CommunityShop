const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGO_URL

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  verified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  }
});



userSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
    
        cb(null, isMatch);
    });
};

const shopperSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true,
  },
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true,
  },
  desc: {
    type: String,
    required: true
  }
});

const Shopper = mongoose.model('Shopper', shopperSchema);
const User = mongoose.model('User', userSchema);

const passportFunction = function(passport){
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, function(email, password, done){
      //Match user
      User.findOne({ email: email.toLowerCase() })
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

module.exports = { User, client, passportFunction, Shopper }
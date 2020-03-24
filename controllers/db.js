const LocalStrategy = require("passport-local");


var passportLocalMongoose = require("passport-local-mongoose"); 

const MongoClient = require('mongodb').MongoClient;
const mongoUsername = process.env.MONGO_USERNAME
const mongoPassword = process.env.MONGO_PASSWORD

const uri = `mongodb+srv://${mongoUsername}:${mongoPassword}@cluster0-xzuqw.gcp.mongodb.net/crmdb?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const bcrypt = require('bcrypt');
let SALT = 10;
const mongoose = require('mongoose');
const mongooseConnect = mongoose.connect(uri)
const userSchema2 = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: 1,
    trim: true
  },
  password: {
    type: String,
    required: true,
  }
});

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: 1,
    trim: true
  },
  password: {
    type: String,
    required: true,
  }
});


userSchema.pre('save', function(next){
  var user = this;

  if (user.isModified('password')){
    bcrypt.genSalt(SALT, function(err, salt){
      if (err) return next(err);
     
     bcrypt.hash(user.password, salt, function(err, hash){
       if (err) return next(err);
        user.password = hash
        next();
     });
    });
  } else {
    next();
  }
});
userSchema.methods.comparePassword = function(candidatePassword, checkpassword){
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
    if (err) return checkpassword(err)
    checkpassword(null, isMatch);
  });
}

userSchema.plugin(passportLocalMongoose);  

const User = mongoose.model('User', userSchema)

const passportFunction = function(passport){
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

  passport.use(new LocalStrategy(User.authenticate()));

}

module.exports = {client, mongooseConnect, User, passportFunction}
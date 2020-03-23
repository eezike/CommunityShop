//https://www.codementor.io/@garethdwyer/building-a-crm-app-with-nodejs-repl-it-and-mongodb-119r72mczg

const fs = require('fs')

const MongoClient = require('mongodb').MongoClient;
const mongoUsername = process.env.MONGO_USERNAME
const mongoPassword = process.env.MONGO_PASSWORD

const uri = `mongodb+srv://${mongoUsername}:${mongoPassword}@cluster0-xzuqw.gcp.mongodb.net/crmdb?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const bcrypt = require('bcrypt');
let SALT = 10;
const mongoose = require('mongoose');
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
const User = mongoose.model('User', userSchema)

//mongoose:
//mongodb: client


module.exports = function(app){
  
  app.get('/', function(req, res){
    

    client.connect(function(err) {

      const shoppers = client.db("crmdb").collection("shoppers");
        
      shoppers.find().toArray(function(err, items){
        if (err) throw err;

        res.render("index", {shoppersList: JSON.stringify(items)});
      });

    }); 


  });

  app.get('/login', function(req, res){

    //https://blog.usejournal.com/easiest-backend-authentication-using-express-mongodb-and-postman-86997c945f18

    res.render("login");

  });


  app.post('/login2', function(req, res){

   User.findOne({'email': req.body.email}, (err, user) => {
     if (!user) res.json({message: 'Login failed, user not found'})
    
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(err) throw err;
      if(!isMatch) return res.status(400).json({
        message: 'Wrong Password'
      });
      //res.status(200).send("Logged in successfully"
      res.redirect('/');
    })

   })

  });

  mongoose.connect(uri).then(() => console.log("mongoose in the DB :)")).catch((error) => console.log(error));

  app.post('/create', function (req, res, next) {
    
    fs.readFile(`US_City_Jsons/${req.body.state}.json`, function read(err, data) {
      if (err) throw err;

      var lng = 0
      var lat = 0
      const stateJson = JSON.parse(data);
      const city = req.body.city.toLowerCase()



      for(block of stateJson)
      {
        if(block.city.toLowerCase() == city)
        {
          lat = block.lat
          lng = block.lng

          client.connect(function(err) 
          {
            const shoppers = client.db("crmdb").collection("shoppers");

            
            const user = new User({
              email: req.body.email,
              password: req.body.pass
            }).save((err, response) => {
              if (err) res.status(400).send(err)
              //res.status(200).send(response)
  
              let shopper = { _id: response._id, name: req.body.name, city: req.body.city, state: req.body.state, lat: lat, lng: lng, desc: req.body.desc };

              shoppers.insertOne(shopper, function(err, res2) 
              {
                if (err) throw err;

                console.log("1 new shopper inserted");
          
                res.redirect('/');
              });
            })
      

          });

        }
      }

      if (lat == 0){
        res.redirect("/login")
      }


    });

  });

  app.get('/profile/:id', function(req, res){

    res.send(`This is user ${req.params.id}'s profile page`)
    
  });

  app.get('/about', function(req, res){
    
    res.render("about")
  });
};
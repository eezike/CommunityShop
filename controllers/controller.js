const fs = require('fs');
const bcrypt = require('bcrypt');

const db = require('./db');


const router = function (app, passport){

  app.get("/", function(req, res){

    db.client.connect(function(err) {

      const shoppers = db.client.db("crmdb").collection("shoppers");
        
      shoppers.find().toArray(function(err, items){
        if (err) throw err;

        const people = JSON.stringify(items)
        var user = null

        if (req.isAuthenticated()){
          console.log("There is a user with the ID", req.user._id)

          

          for (person of items){
            console.log("The person ID is ", person._id, person.name)
            if (JSON.stringify(person._id) == JSON.stringify(req.user._id)){
              user = person
            }
          }
        }
        
        console.log("User:", user)

        res.render("index", {shoppersList: people, currentUser:  JSON.stringify(user)});
      });

    }); 
  });

  app.get("/login", function(req, res){
    res.render("login")
  });
  


  app.post("/login2", function(req, res, next){
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login'
    })(req, res, next);

  });

  app.get("/logout", function(req, res){
    req.logout();
    res.json({ out: "You logged" })

  });


  app.post("/create", function(req, res){
    
    fs.readFile(`US_City_Jsons/${req.body.state}.json`, function read(err, data) {
      if (err) throw err;

      var lng = 0
      var lat = 0
      const stateJson = JSON.parse(data);
      const city = req.body.city.toLowerCase()
      
      for(block of stateJson) {
        
        if(block.city.toLowerCase() == city) {
          lat = block.lat
          lng = block.lng

          db.client.connect(function(err) {
            const shoppers = db.client.db("crmdb").collection("shoppers");

            db.User.findOne({ email: req.body.email }).then(function(user){
              if (user) {
                //user already exists
                res.json({message: 'User exists'})
              } else {
                const newUser = new db.User({
                  email: req.body.email,
                  password: req.body.pass
                });

                bcrypt.genSalt(10, function(err, salt){
                  bcrypt.hash(newUser.password, salt, function(err, hash){
                    if (err) throw err;
                    //set password to hash
                    newUser.password = hash;

                    //save user
                    newUser.save()
                    .then(function(user){
                      const shopper = { _id: user._id, name: req.body.name, city: req.body.city, state: req.body.state, lat: lat, lng: lng, desc: req.body.desc };

                      shoppers.insertOne(shopper, function(err, res2){
                          if (err) throw err;

                          console.log("1 new shopper inserted");
                    
                          res.redirect('/login')
                        });
                    }).catch((err) => console.log(err))
                  })
                });

                

              }
            })

          });

        }
      }

      if (lat == 0){
        res.res.json({error: 'Your city doesnt exist'})
      }


    });


  });
  
  
    app.get("/about", function(req, res){
    res.render("about")
  });

  app.get("/privacypolicy", function(req, res){
    res.render("pp")
  });


}



module.exports = router;
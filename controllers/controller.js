//https://www.codementor.io/@garethdwyer/building-a-crm-app-with-nodejs-repl-it-and-mongodb-119r72mczg

const fs = require('fs')

const db = require('./db');


module.exports = function(app, passport){
  
  app.get('/', function(req, res){
    

    db.client.connect(function(err) {

      const shoppers = db.client.db("crmdb").collection("shoppers");
        
      shoppers.find().toArray(function(err, items){
        if (err) throw err;

        console.log("User:", req.isAuthenticated())

        res.render("index", {shoppersList: JSON.stringify(items), currentUser: req.user});
      });

    }); 


  });

  app.get('/login', function(req, res){

    //https://blog.usejournal.com/easiest-backend-authentication-using-express-mongodb-and-postman-86997c945f18

    res.render("login");

  });

  app.post("/login3", passport.authenticate("local",{
    successRedirect:"/",
    failureRedirect:"/login"
}),function(req, res){
    res.send("User is "+ req.user._id);
});



  app.post('/login2', function(req, res){

   db.User.findOne({'email': req.body.email}, (err, user) => {
     if (!user) res.json({message: 'Login failed, user not found'})
    
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(err) throw err;
      if(!isMatch) return res.status(400).json({
        message: 'Wrong Password'
      });
      //res.status(200).send("Logged in successfully"
      res.redirect("/");
    })

   })

  });

  db.mongooseConnect.then(() => console.log("mongoose in the DB :)")).catch((error) => console.log(error));

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

          db.client.connect(function(err) 
          {
            const shoppers = db.client.db("crmdb").collection("shoppers");

            
            const user = new db.User({
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
          
                passport.authenticate("local")(req, res, function(){
                    res.redirect("/");       
                  });
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

  app.get("/logout", function(req, res){    
     req.logout();    
     res.redirect("/");
  });
};
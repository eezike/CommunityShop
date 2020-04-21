const fs = require('fs');
const async = require('async');
const crypto = require('crypto');

const db = require('./db');
const resetPasswordEmail = require('./mailer').resetPasswordEmail;


const router = function (app, passport){

  app.get("/", function(req, res){

    db.client.connect(function(err) {
        
      db.client.db("crmdb").collection("shoppers").find().toArray(function(err, items){
        if (err) throw err;

        const people = JSON.stringify(items)
        var user = null

        if (req.isAuthenticated()){   

          for (person of items){
            if (JSON.stringify(person._id) == JSON.stringify(req.user._id)){
              user = person
            }
          }
        }

        res.render("home", {shoppersList: people, currentUser:  JSON.stringify(user)});
      });

    }); 
  });

  app.get("/login", function(req, res){
    if (req.user){
      res.redirect("/")
    } else {
      res.render("login")
    }
  });

  app.get('/reset/:token', function(req, res) {
    db.User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        return res.render("error", {name: "Token Error", desc: "Password reset token is invalid or has expired!"})
      }

      //res.json({status: "sucess", message: "You made it! You can reset your password"})
      res.render('reset', {token: req.params.token});
    });
  });

  app.post('/reset/:token', function(req, res) {
    async.waterfall([
      function(done) {
        db.User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
   
            return res.render('error', {name: "Token Error", desc: "Password reset token is invalid or has expired."});
          } else {
              user.password = req.body.password
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;

              user.save(function(err) {
                req.login(user, function(err) {
                  done(err, user);
                });
              });

          }  
        });
      },
      function(user, done) {
        //maybe send an email that passwords was changed
        return res.redirect('/');
      }
    ], function(err) {
      res.redirect('/');
    });
  });

  app.post("/login", function(req, res){
    db.User.findOne({email: req.body.email.toLowerCase().trim()}, function(err, user){
      if (err) throw err;

      if (user){

        user.comparePassword(req.body.password, function(err, isMatch){
          if (err) throw err;

          if (isMatch){
            req.login(user, function(){
               res.json({status: "success", message: "Login worked"})
            }) 
          } else {
            res.json({status: "error", message: "Incorrect password"});
          }
        })
      } else {
        res.json({status: "error", message: "No user associated with this email!"})
      } 
    });

  });

  app.post("/logout", function(req, res){
    req.logout();
    res.redirect("/login")

  });

  app.post("/save", function(req, res){

    if (req.user){

      const query = { _id: req.user._id };
      console.log("0")
      if (req.body.desc || req.body.desc !== ""){
        console.log("1")
        db.Shopper.updateOne(query, {$set: {desc: req.body.desc}}, function(err, result) {

          if (err) throw err;
          console.log("2")
          console.log("1 document updated");
            
        });
      }

      if (req.body.oPass && req.body.nPass){
        db.User.findOne(query).then(function(user){
          if (user){
            user.comparePassword(req.body.oPass, function(err, isMatch){
              if (err) throw err;

              if (isMatch){
                  user.password = req.body.nPass;
                  user.save(function(err){
                    if (err) throw err;
                    console.log("1 document updated");
                  });
                  
              } else {
                  return res.json({message : "Error: Your old password is invalid", status : "error"});
              }
            })
          } else{
            res.json({message : "Something went wrong! Please log out and log back in!", status : "error"});
          }
        });


      }

      res.json({message : "Your information was succesfully updated!", status : "success"});
    } else {
      res.redirect('/');
    }
 
  });

  app.post("/delete", function(req, res){

    if (req.user){

      db.client.connect(function(err){
        if (err) throw err;

        const crmdb = db.client.db("crmdb");

        const query = { _id: req.user._id};

        crmdb.collection("users").deleteOne(query, function(err, obj) {
          if (err) throw err;

          crmdb.collection("shoppers").deleteOne(query, function(err, obj){
            
            if (err) throw err;

            console.log("1 document deleted");
            req.logout()
            res.redirect("/login"); //cannot attach message

          });
          
        });
      });

    } else {
      res.render("error", {name: "Double Delete", desc: "You have already deleted your account!"})
    }

  })

  app.post("/create", function(req, res, next){
    
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

            db.User.findOne({ email: req.body.email.toLowerCase() }).then(function(user){
              if (user) {
                //user already exists
                res.json({message : "Error: This email is already associated with a user!", status : "error"});
              } else {
                const newUser = new db.User({
                  email: req.body.email.toLowerCase(),
                  password: req.body.pass
                });
                //save user
                newUser.save()
                .then(function(user){
                  const shopper = { _id: user._id, name: req.body.name, city: block.city, state: req.body.state, lat: lat, lng: lng, desc: req.body.desc };

                  db.Shopper.create(shopper, function(err, res2){
                    if (err) throw err;

                    console.log("1 new shopper inserted");

                    req.login(newUser, function(err) {
                      if (err) { res.redirect("/login") }
                        res.redirect('/');
                      });
                         
                  });
                }).catch((err) => console.log(err))
              }
            })

          break;
        }
      }

      if (lat == 0){
        res.json({message : "Error: the city entered was invalid", status : "error"});
      }


    });
  });

  app.post('/forgot', function(req, res,  next){

    const email = req.body.email.toLowerCase();
    if (email){
      async.waterfall([
        function(done) {
          crypto.randomBytes(20, function(err, buf) {
            var token = buf.toString('hex');

            done(err, token);
          });
        }
        ,
        function(token, done) {

              db.User.findOne({email}, function(err, user) {
              if (err) throw err;

              if (user){
                db.Shopper.findOne({_id: user._id}, function(err, result){
                  if (err) throw err;
                  user.resetPasswordToken = token;
                  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                  user.save(function(err) {
                    done(err, token, user, result.name);
                  });

                })
              } else {
                //alert no account exists for this user
                return res.json({message : "No account exists for this user!", status : "error"})
              }
            });


        }
        ,
        function(token, user, name, done) {
          //send mail to the email
          resetPasswordEmail(email, name, token)
          //alert that email was sent
          res.json({message : `A reset password email was sent to ${email}`, status : "success"})
        }
      ], function(err) {
          if (err) return next(err);
          res.redirect('/login');
        });
    } else {
      res.json({message : "No email was entered", status : "error"})
    }
    
  });
   
  app.get("/about", function(req, res){
    res.render("about")
  });

  app.get("/privacypolicy", function(req, res){
    res.render("pp")
  });

  app.get("/termsofservice", function(req, res){
    res.render("tos")
  });

  app.get("*", function(req, res){
    res.status(404).render("error", {name: "404", desc: "Page does not exist"})
  });
}



module.exports = router;

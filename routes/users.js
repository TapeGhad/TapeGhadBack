const router = require('express').Router();
const User = require('../models/user.model');
const Session = require('../models/session.model');
const Collection = require('../models/collection.model');
const Item = require('../models/item.model');
const async = require("async");


router.route('/').get((req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/admin').get((req, res) => {
  User.find({}, {username: 1, _id: 0}, async function(err, users) {
      
      users.forEach(ob => {
        var item = 0;
        var collections=0;
        Collection.find({owner: ob.username}, function(err, coll) {
          
          collections = coll.length;
          coll.forEach(coll => {
          Item.find({collectionName: coll.name}, function(err, items) {
              
              item=item + items.length;
              ob.amountColl= collections;
              ob.amountItems= item;
            })
          })})
          
      })
      res.json(users)
  })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const newUser = new User({
      username,
      password,
      email
});
  console.log(newUser);

  User.findOne({username: username}, function( err, user) {
    console.log("1 step:")
    if (user)
     {
      res.json('User already exists')
     }
     else {
        User.findOne({email: email}, function( err, email) {
          console.log("2 step:")
          if (email)
          {
            res.json('Email already exists')
          }
          else {
            console.log("3 step:")
            newUser.save()
              .then(() => {
                    res.json('User added succesfully.')
                })
              .catch(err => {console.log("Here is err");res.json('Some error, try later')});
          }
        })
     }
  })
  .catch(err => {console.log("Cant find"); res.json('Some error, try later')});
});

router.route('/checkUserData').post((req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({username: username})
    .then(user => {
     if (password===user.password)
     {
       const newSession = new Session({username})
       newSession.save().then(() => res.json(user.email))
     }
     else {
      res.json('Incorrect data.')
     }
    })
    .catch(err => res.json('Incorrect data.'));
});


router.route('/confirmCookie').post((req, res) => {
  const username = req.body.username;

  Session.findOne({username: username}, function( err, user) 
    {
      if (user) {res.json('Exists')}
      else {res.json('Not Exists')}
    })
    .catch(err => res.json('Not Exists'));
});

router.route('/logout').post((req, res) => {
  const username = req.body.username;

  Session.findOneAndDelete({username: username}, function( err, user) 
    {
      res.send("Logged out")
    })
    .catch(err => res.json('Not Exists'));
});



module.exports = router;
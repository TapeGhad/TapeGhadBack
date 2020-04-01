const router = require('express').Router();
const User = require('../models/user.model');
const Session = require('../models/session.model');


router.route('/').get((req, res) => {
  User.find()
    .then(users => res.json(users))
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

  User.findOne({username: username}, function( err, user) {
      
    if (user)
     {
      res.json('User already exists')
     }
     else {
        User.findOne({email: email}, function( err, email) {
          if (email)
          {
            res.json('Email already exists')
          }
          else {
            newUser.save()
              .then(() => {
                    res.json('User added succesfully.')
                })
              .catch(err => res.json('Some error, try later'));
          }
        })
     }
  })
  .catch(err => res.json('Some error, try later'));
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
const router = require('express').Router();
const User = require('../models/user.model');
const Session = require('../models/session.model');
const Collection = require('../models/collection.model');
const Item = require('../models/item.model');

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

router.route('/').get((req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

// router.route('/admin').get((req, res) => {
//   User.find({}, {username: 1, _id: 0}, async function(err, users) {
      
//     for (var user of users) {
//       user = await GetInfoUser(user);
//     }
//       res.json(users)
//   })
//     .catch(err => res.status(400).json('Error: ' + err));
// });

router.route('/add').post((req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const newUser = new User({
      username,
      password,
      email,
      status: 1,
      statusAccess: 1
});
  console.log(newUser);

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
              .catch(err => {res.json('Some error, try later')});
          }
        })
     }
  })
  .catch(err => { res.json('Some error, try later')});
});

router.route('/checkUserData').post((req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({username: username})
    .then(user => {
     if (password===user.password)
     {
       const newSession = new Session({username})
       if (user.status===0) res.json("Blocked")
       else {
       newSession.save().then(() => res.json(user.email))
     }
     }
     else {
      res.json('Incorrect data.')
     }
    })
    .catch(err => res.json('Incorrect data.'));
});

router.route('/checkAccess').post((req, res) => {
  const username = req.body.username;

  User.findOne({username: username}, function( err, user) 
    {
      if (user,statusAccess===1) {res.json(1)}
      else {res.json(2)}
    })
    .catch(err => res.json('Not Exists'));
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

router.route('/block').post((req, res) => {
  const username = req.body.username;

  Session.findOneAndDelete({username: username}, async function( err, user) 
    {
      await User.findOneAndUpdate({username: username}, {status: 0}).then(ok => res.json("Okay!"))
    })
    .catch(err => res.json('Not Exists'));
    
});

router.route('/unblock').post((req, res) => {
  const username = req.body.username;

  User.findOneAndUpdate({username: username}, {status: 1}).then(ok => res.json("Okay!"))
    .catch(err => res.json('Not Exists'));
    
});

router.route('/user').post((req, res) => {
  const username = req.body.username;

  User.findOneAndUpdate({username: username}, {statusAccess: 1}).then(ok => res.json("Okay!"))
    .catch(err => res.json('Not Exists'));
    
});

router.route('/admin').post((req, res) => {
  const username = req.body.username;

  User.findOneAndUpdate({username: username}, {statusAccess: 2}).then(ok => res.json("Okay!"))
    .catch(err => res.json('Not Exists'));
    
});

router.route('/delete').post((req, res) => {
  const username = req.body.username;

  Session.findOneAndDelete({username: username}).then(async () => {
    User.findOneAndDelete({username: username}).then( async ()=> {
      Collection.find({owner: username}).then(async coll => {
        await asyncForEach(coll, async (collection) => {
              await Item.deleteMany({collectionName: collection.name})
        })
        await Collection.deleteMany({owner: username}).then (() => res.json("Deleted"))
      })
    })
  })
    .catch(err => res.json('Not Exists'));
    
});

router.route('/test').get((req, res) => {
  User.find({}, {username:1, status: 1, _id: 0})
    .then(async users => {
      var obj = [];
      var iter = 0;
      await asyncForEach(users, async (user) => {
        var collections=0;
        var itemAmount=0
        await Collection.find({owner: user.username}).then( async coll=> {
          collections+=coll.length
          await asyncForEach(coll, async (collection) => {
            await Item.find({collectionName: collection.name}, {name: 1})
              .then(async items => {
                itemAmount+=items.length
              })
          })
        })
        obj[iter]=user
        obj.push(collections)
        obj.push(itemAmount)
        console.log(obj)
        console.log("Working");
        iter+=3;
      })
      console.log("Done!")
      res.json(obj)
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
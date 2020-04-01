const router = require('express').Router();
const Collection = require('../models/collection.model');
const Items = require('../models/item.model')



router.route('/').get((req, res) => {

  Collection.find({}, {_id: 0,  owner: 1, name:1, description: 1, topic: 1, items: 1})
    .then(coll => res.json(coll))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/owner').post((req, res) => {
  const username = req.body.owner;

  Collection.find({owner: username}, {_id: 0,  name:1, description: 1, topic: 1, items: 1})
    .then(coll => res.json(coll))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/info').post((req, res) => {
  const nameColl = req.body.nameColl;

  Collection.findOne({name: nameColl}, {_id: 0,owner:1, name:1, description: 1, topic: 1, items: 1})
    .then(coll => res.json(coll))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const owner = req.body.owner;
  const name = req.body.name;
  const description = req.body.description;
  const topic = req.body.topic;
  const newColl = new Collection({
      owner,
      name,
      description,
      topic,
      items: 0
});

  Collection.findOne({name: name}, function( err, coll) {
    if (coll)
     {
      res.json('Collection already exists')
     }
     else {
        newColl.save()
            .then(() => {
                res.json('Collection added succesfully.')
            })
            .catch(err => res.json('Some error, try later222'));
     }
  })
  .catch(err => res.json('Some error, try later111'));
});

router.route('/update').post((req, res) => {
  const oldnameColl = req.body.oldnameColl;
  const newnameColl = req.body.newnameColl;
  const description = req.body.description;
  const topic = req.body.topic;

  if (oldnameColl!==newnameColl) {
    Collection.findOne({name: newnameColl}, function( err, coll){
    if (coll)
     {
      res.json('Collection already exists')
     }
     else {
       Collection.findOneAndUpdate({name: oldnameColl}, {name: newnameColl, description: description, topic: topic})
       .then(() => {
         res.json("Collection updated succesfully.")
       })
     }
  })
    .catch(err => res.status(400).json('Error: ' + err));
}
else {
    Collection.findOneAndUpdate({name: oldnameColl}, {name: newnameColl, description: description, topic: topic})
       .then(() => {
         res.json("Collection updated succesfully.")
       })
}
});

router.route('/delete').post((req, res) => {
  const collname = req.body.collname;
  Collection.findOneAndDelete({name: collname}).then(ok => {
    Items.deleteMany({collectionName: collname}).then(ok =>res.send("Ok"))
    
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/checkUserData').post((req, res) => {
//   const username = req.body.username;
//   const password = req.body.password;

//   User.findOne({username: username})
//     .then(user => {
//      if (password===user.password)
//      {
//        const newSession = new Session({username})
//        newSession.save().then(() => res.json(user.email))
//      }
//      else {
//       res.json('Incorrect data.')
//      }
//     })
//     .catch(err => res.json('Incorrect data.'));
});







module.exports = router;
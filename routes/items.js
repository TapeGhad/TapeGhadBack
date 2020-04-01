const router = require('express').Router();
const Item = require('../models/item.model');
const Tag = require('../models/tags.model');
const Collection = require("../models/collection.model")


router.route('/').get((req, res) => {
  
    Item.find({}, {_id: 0, collectionName: 1, name:1, tags: 1, likes: 1, comments: 1})
      .then(item => res.json(item))
      .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/owner').post((req, res) => {
    const nameColl = req.body.nameColl;
  
    Item.find({collectionName: nameColl}, {_id: 0,  name:1, tags: 1, likes: 1, comments: 1})
      .then(item => res.json(item))
      .catch(err => res.status(400).json('Error: ' + err));
});

// router.route('/info').post((req, res) => {
//   const nameColl = req.body.nameColl;

//   Collection.findOne({name: nameColl}, {_id: 0,owner:1, name:1, description: 1, topic: 1})
//     .then(coll => res.json(coll))
//     .catch(err => res.status(400).json('Error: ' + err));
// });

router.route('/add').post((req, res) => {
  
  const nameColl = req.body.nameColl;
  const name = req.body.name;
  const tags = req.body.tags;

  const newItem = new Item({
    collectionName: nameColl,
    name,
    tags
  });
  let check=true;
  Item.find({collectionName: nameColl}, function( err, coll) {
    if (coll)
     {
      coll.forEach(elem => {
          if (elem.name===name) {check=false; res.json("Item already exists");}
      })
      if (check) {
        newItem.save()
        .then(() => {
           
            tags.forEach(tag => {
                
                Tag.findOne({name: tag}, function(err, tagfound) {
                    if (tagfound) {}
                    else {
                        let newTag = new Tag({
                            name: tag
                        });
                        newTag.save().then(() => {})
                        .catch(err => res.json('Some error, try later222'));
                    }
                })
            })
            Collection.findOne({name: nameColl}, function(err, coll) {
                const items = coll.items +1;
                Collection.findOneAndUpdate({name: nameColl}, {items: items}).then(()=>{})
            })
            res.json('Item added succesfully.')
        })
        .catch(err => res.json('Some error, try later'));
      }
     }
  })
  .catch(err => res.json('Some error, try later111'));
});

router.route('/delete').post((req, res) => {
    const itemname = req.body.itemname;
    const nameColl = req.body.nameColl;
    Item.findOneAndDelete({collectionName: nameColl, name: itemname}).then(ok => {
        Collection.findOne({name: nameColl}, function(err, coll) {
            const items = coll.items -1;
            Collection.findOneAndUpdate({name: nameColl}, {items: items}).then(()=>{})
        })
        res.send("Ok")})
      .catch(err => res.status(400).json('Error: ' + err));
  });

router.route('/update').post((req, res) => {
    const oldnameItem = req.body.oldName;
    const newnameItem = req.body.newName;
    const nameColl = req.body.nameColl;
    const tags = req.body.tags;

    let check=true;
    if (oldnameItem!==newnameItem) {
        Item.find({collectionName: nameColl}, function( err, coll) {
            if (coll)
             {
              coll.forEach(elem => {
                  if (elem.name===newnameItem) {check=false; res.json("Item already exists");}
              })
              if (check) {

                Item.findOneAndUpdate({collectionName: nameColl, name: oldnameItem}, {name: newnameItem, tags: tags})
                    .then(() => {
                        tags.forEach(tag => {
                        
                            Tag.findOne({name: tag}, function(err, tagfound) {
                                if (tagfound) {}
                                else {
                                    let newTag = new Tag({
                                        name: tag
                                    });
                                    newTag.save().then(() => {})
                                    .catch(err => res.json('Some error, try later222'));
                                }
                            })
                        })
                        res.json("Item updated succesfully.")
                    })
                .catch(err => res.json('Some error, try later'));
              }
             }
      
    })
      .catch(err => res.status(400).json('Error: ' + err));
  }
  else {
      Item.findOneAndUpdate({collectionName: nameColl, name: oldnameItem}, {name: newnameItem, tags: tags})
         .then(() => {
            tags.forEach(tag => {
                        
                Tag.findOne({name: tag}, function(err, tagfound) {
                    if (tagfound) {}
                    else {
                        let newTag = new Tag({
                            name: tag
                        });
                        newTag.save().then(() => {})
                        .catch(err => res.json('Some error, try later222'));
                    }
                })
            })
           res.json("Item updated succesfully.")
         })
  }
  });

router.route('/like').post((req, res) => {
    const nameItem = req.body.nameItem;
    const nameColl = req.body.nameColl;
    const username = req.body.username;

    Item.findOne({collectionName: nameColl, name: nameItem}, function(err, item) {
        if (item) {
            let obj = item;
            if (obj.likes.includes(username)) {
                obj.likes= obj.likes.filter(user => user!==username)
                Item.findOneAndUpdate({collectionName: nameColl, name: nameItem}, {likes: obj.likes}).then(ok => {res.json("ok")})
                }
            else {
                obj.likes.push(username);
                Item.findOneAndUpdate({collectionName: nameColl, name: nameItem}, {likes: obj.likes}).then(ok => {res.json("ok")})
            }
        }
    })
});

router.route('/add-comment').post((req, res) => {
    const nameItem = req.body.nameItem;
    const nameColl = req.body.nameColl;
    const comment = req.body.comment;
    const author = req.body.author;

    Item.findOne({collectionName: nameColl, name: nameItem}, function(err, item) {
        if (item) {
            const commentar = {
                author: author,
                comment: comment
            }
            let obj = item;
            obj.comments.push(commentar)
            Item.findOneAndUpdate({collectionName: nameColl, name: nameItem}, {comments: obj.comments}).then(ok => {res.json("ok")})
            }
    })
});

// router.route('/delete').post((req, res) => {
//   const collname = req.body.collname;
//   Collection.findOneAndDelete({name: collname}).then(ok => res.send("Ok"))
//     .catch(err => res.status(400).json('Error: ' + err));
// });

// router.route('/checkUserData').post((req, res) => {
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
// });







module.exports = router;
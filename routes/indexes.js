const router = require('express').Router();
const Item = require('../models/item.model');
const Collection = require("../models/collection.model")

router.route('/add/collection').get((req, res) => {
    Collection.createIndex({description: "text", topic: "text"}, {"weights": {description: 1, topic: 2}}).then(ok => res.json("Ok"))
    .catch(err => res.json('Some error, try later111'));
});

router.route('/add/item').get((req, res) => {
    Item.createIndex({collectionName: "text", name: "text", tags: "text", comments:"text"}, {"weights": {collectionName: 1, name: 2, tags: 3, comments: 4}}).then(ok => res.json("Ok"))
    .catch(err => res.json('Some error, try later111'));
});
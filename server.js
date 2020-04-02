const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT;

const usersRouter = require('./routes/users');
const CollRouter = require('./routes/collections');
const TagRouter = require('./routes/tags');
const ItemRouter = require('./routes/items');


const uri = "mongodb+srv://TapeGhad:1563qazQAZ1563@tapeghadkp-4avog.mongodb.net/test?retryWrites=true&w=majority";

const Topics = require('./models/topics.model');
const Collection = require('./models/collection.model');
const Item = require('./models/item.model');


app.use(cors());
app.use(express.json());
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true,useFindAndModify: false  });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

app.use('/users', usersRouter);

app.use('/collections', CollRouter);

app.use('/items', ItemRouter);

app.use('/tags', TagRouter);

app.get('/topics', (req, res) => {
  Topics.find({}, {_id: 0, name: 1}, function (err, topics) {
    res.send(topics)
  })
})

app.post('/topics/add', (req, res) => {
  const nameTopic = req.body.nameTopic;
  const newTopic = new Topics({
    name: nameTopic
  })
  newTopic.save().then(ok=> res.send("Saved"))
})
// db.collections.createIndex({description: "text", topic: "text"}, {"weights": {description: 1, topic: 2}})
//db.items.createIndex({collectionName: "text", name: "text", tags: "text", comments:{"$**":"text"}}, {"weights": {collectionName: 1, name: 2, tags: 3, comments: 4}})
app.post('/search', (req, res) => {
  const searchStr = req.body.search;

  Collection.find({$text: {$search: searchStr}},{score:{$meta: "textScore"},_id: 0, name: 1, description:1,topic:1, items:1}).sort({score:{$meta: "textScore"}}).then(data => {
      Item.find({$text: {$search: searchStr}},{score:{$meta: "textScore"}, _id: 0,collectionName: 1, name: 1, tags: 1, comments: 1}).sort({score:{$meta: "textScore"}}).then(items => {
        items.forEach( item => {
          data.push(item)
        })
        if (data.length===0) res.json("no")
        else res.json(data)
      })
  })




})

app.get('/', (req, res) => {
    res.send("Hello my friend!")
})

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
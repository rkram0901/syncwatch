var express = require('express');
var config = require('../constants');
var _ = require('lodash')
var MongoClient = require('mongodb').MongoClient;
var router = express.Router();

/* GET users listing. */
router.get('/', async function(req, res, next) {
  const collectionName = config.constants.collections.steps
  const client = await getMongoClient();  
  const database = client.db(config.constants.nosqldb.dbName, collectionName);
  const response = await database.collection(collectionName).find({}).toArray();

  res.send(response);
});

router.post('/', async function(req, res, next) {
  const collectionName = config.constants.collections.steps
  const client = await getMongoClient();  
  const database = client.db(config.constants.nosqldb.dbName, collectionName);
  let dateToUpdate = new Date();
  let content = req.body;
  content.date = dateToUpdate;
  content.stepsCount = content.stepsCount
  var result = await database
      .collection(collectionName)
      .updateMany(
        {},
        {"$set":  content},
        {upsert: true}
      )
  res.send({result})
})

router.post('/reset/:id', async function(req, res, next) {
  const collectionName = config.constants.collections.steps
  const client = await getMongoClient();  
  const database = client.db(config.constants.nosqldb.dbName, collectionName);
  let dateToUpdate = new Date();
  var result = await database
      .collection(collectionName)
      .updateOne({"id": _.parseInt(req.params.id)}, {"$set": {"date": dateToUpdate,
        "stepsCount": 0
      }},
      {upsert: true})
  res.send({result})
})

async function getMaxId(database, collectionName) {

  var result = await database
      .collection(collectionName).aggregate([
          {
              "$group": {
                  "_id": null,
                  "maxRequestId": { "$max": "$id" }
              }
          }
      ]).toArray();
  let maxid = 1;
  
  if (!_.isEmpty(result))
    maxid = result[0].maxRequestId + 1;
  console.log(maxid);
  return maxid;

}

async function getMongoClient() {
  const client = await MongoClient.connect(
    config.constants.nosqldb.connectionUrl,
    { useNewUrlParser: true })
  return client
}

module.exports = router;

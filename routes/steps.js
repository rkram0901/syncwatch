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
  const response = await database.collection(collectionName).find({}).limit(1).sort({$natural:-1}).toArray();

  res.send(response);
});

router.post('/', async function(req, res, next) {
  const collectionName = config.constants.collections.steps
  const client = await getMongoClient();  
  const database = client.db(config.constants.nosqldb.dbName, collectionName);
  var maxid = await getMaxId(database, collectionName);
  console.log(maxid);
  let dateToUpdate = new Date();
  let content = req.body;
  content.id = maxid;
  content.date = dateToUpdate;
  content.stepsCount = content.stepsCount
  var result = await database
      .collection(collectionName)
      .insertOne(content)
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

  //console.log(result);
  //console.log((result[0].maxRequestId));
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

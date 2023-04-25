let config = {
    nosqldb: {
      connectionUrl: "mongodb://allrwelcome:allrwelcome@cluster0-shard-00-00.uczbr.mongodb.net:27017,cluster0-shard-00-01.uczbr.mongodb.net:27017,cluster0-shard-00-02.uczbr.mongodb.net:27017/test?authSource=admin&replicaSet=atlas-tyk3ok-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true",//"mongodb://localhost:27017/?readPreference=primary&ssl=false",
      dbName: "onboarding",
    },
    collections: {
      steps: "userStepSync"
    },
  };
  
module.exports.constants = config;
  
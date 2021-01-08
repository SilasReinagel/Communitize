
const MongoClient = require('mongodb').MongoClient;
const result = require('../result');
const connStr = process.env.CommunitizeMongoConnStr;
const dbName = 'communitize';

const executeDbTransaction = (dbAction) => MongoClient.connect(connStr, { useUnifiedTopology: true })
  .then(client => dbAction(client.db(dbName)))
  .catch(e => result.error('Server Error', e))

const executeCollectionAction = (collectionName, collectionAction) => 
  executeDbTransaction(db => collectionAction(db.collection(collectionName)));

exports.executeCollectionAction = executeCollectionAction;

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const result = require('../result');
const connStr = process.env.CommunitizeMongoConnStr;
const dbName = 'communitize';
const collectionName = 'userprofiles';

const executeDbTransaction = (dbAction) => MongoClient.connect(connStr, { useUnifiedTopology: true })
  .then(client => dbAction(client.db(dbName)))
  .catch(e => result.error('Server Error', e))

const executeCollectionAction = (collectionAction) => 
  executeDbTransaction(db => collectionAction(db.collection(collectionName)));

const logged = (str, o) => { console.log('Database - ', str, o); return o };
const withoutId = (obj) => withoutProps(obj, '_id');

const withoutProps = (obj, ...props) => {
  const clone = JSON.parse(JSON.stringify(obj));
  props.map(p => delete clone[p]);
  return clone;
}

exports.getUserById = (userId) => 
  executeCollectionAction(c => c
    .findOne({'_id': ObjectId(userId)})
    .then(userProfile => result.success(userProfile))
    .catch(e => result.error('Not Found', e)));

exports.getUserByUsername = (username) => 
  executeCollectionAction(c => c
    .findOne({'username': username})
    .then(userProfile => result.success(userProfile))
    .catch(e => result.error('Not Found', e)));

exports.putUser = (userProfile) =>
  executeCollectionAction(c => c
    .updateOne({'username': userProfile.username}, { $set: withoutId(userProfile) }, { upsert: true })
    .then(r => result.success(logged(!!r.upsertedId ? 'Updated User' : 'Created User', userProfile)))
    .catch(e => result.error('Server Error', e)));

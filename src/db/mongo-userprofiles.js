const db = require('./mongo-db');
const ObjectId = require('mongodb').ObjectID;
const result = require('../result');

const collectionName = 'userprofiles';

const logged = (str, o) => { console.log('Database - ', str, o); return o };
const withoutId = (obj) => withoutProps(obj, '_id');
const withoutProps = (obj, ...props) => {
  const clone = JSON.parse(JSON.stringify(obj));
  props.map(p => delete clone[p]);
  return clone;
}

const ifHasRequiredProps = (obj, props, action) => {  
  for (i = 0; i < props.length; i++)
    if (!obj.hasOwnProperty(props[i]))
      return result.error('Bad Request', `Missing Required Property: '${props[i]}'`);
  return action();
}

exports.getUserById = (userId) => 
  db.executeCollectionAction(collectionName, c => c
    .findOne({'_id': ObjectId(userId)})
    .then(userProfile => result.success(userProfile))
    .catch(e => result.error('Not Found', e)));

exports.getUserByUsername = (username) => 
  db.executeCollectionAction(collectionName, c => c
    .findOne({'username': username})
    .then(userProfile => result.success(userProfile))
    .catch(e => result.error('Not Found', e)));

exports.putUser = (userProfile) =>
  ifHasRequiredProps(userProfile, ['username', 'bio', 'dob', 'links'], () => 
    db.executeCollectionAction(collectionName, c => c
      .updateOne({'username': userProfile.username}, { $set: withoutId(userProfile) }, { upsert: true })
      .then(r => result.success(logged(!!r.upsertedId ? 'Updated User' : 'Created User', userProfile)))
      .catch(e => result.error('Server Error', e))));

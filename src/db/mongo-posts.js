const db = require('./mongo-db');
const ObjectId = require('mongodb').ObjectID;
const result = require('../result');

const collectionName = 'posts';

const logged = (str, o) => { console.log('Database - ', str, o); return o };
const clone = (obj) => JSON.parse(JSON.stringify(obj));
const withoutId = (obj) => withoutProps(obj, '_id');
const withoutProps = (obj, ...props) => {
  const r = clone(obj);
  props.map(p => delete r[p]);
  return r;
};

const ifHasRequiredProps = (obj, props, action) => {  
  for (i = 0; i < props.length; i++)
    if (!obj.hasOwnProperty(props[i]))
      return result.error('Bad Request', `Missing Required Property: '${props[i]}'`);
  return action();
}

exports.putPost = (post) => 
  ifHasRequiredProps(post, ['userId', 'username', 'timestamp', 'photoUrl', 'title', 'body'], () => 
    db.executeCollectionAction(collectionName, c => c
      .updateOne({'_id': ObjectId(post._id)}, { $set: withScoresAndComments(withoutId(post)) }, { upsert: true })
      .then(r => result.success(logged(!!r.upsertedId ? `Updated Post` : 'Created Post', { postId: post._id || r.upsertedId._id })))
      .catch(e => result.error('Server Error', e))));

exports.getRecentPosts = (number) =>
  db.executeCollectionAction(collectionName, c => c
    .find()
    .sort({ $natural: -1 })
    .limit(number))
    .then(async dbCursor => result.success(logged('Retrieved Recent Posts', await dbCursor.toArray())))
    .catch(e => result.error('Server Error', e));

exports.addComment = (comment) =>
  ifHasRequiredProps(comment, ['postId', 'userId', 'username', 'timestamp', 'comment'], () =>
    db.executeCollectionAction(collectionName, c => c
      .updateOne({ '_id': ObjectId(comment.postId)},{ $push: { comments: comment } }))
      .then(r => result.success(logged(`Added Comment to Post ${comment.postId}`, { postId: comment.postId })))
      .catch(e => result.error('Server Error', e)));

exports.scorePost = (score) =>   
  ifHasRequiredProps(score, ['postId', 'userId', 'username', 'timestamp', 'value'], () =>
    db.executeCollectionAction(collectionName, c => c
      .updateOne({ '_id': ObjectId(score.postId)},{ $push: { scores: score }, $inc: { totalScore: score.value } }))
      .then(r => result.success(logged(`User Scored Post ${score.postId} ${score.value}`, { postId: score.postId })))
      .catch(e => result.error('Server Error', e)));

const withScoresAndComments = (obj) => {
  const r = clone(obj);
  if (!obj.hasOwnProperty('totalScore'))
    r.totalScore = 0;
  if (!obj.hasOwnProperty('scores'))
    r.scores = [];
  if (!obj.hasOwnProperty('comments'))
    r.comments = [];
  return r;
}

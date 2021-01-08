const fastify = require('fastify')({ logger: true });
const userProfiles = require('./db/mongo-userprofiles');
const posts = require('./db/mongo-posts');

// API Info

fastify.get('/', async (req, reply) => {
  return { app: "communitize", version: '0.0.1' }
});

// User Profiles

fastify.post('/users', async (req, reply) => 
  logged('Create/Update User Profile', 
    req.body, 
    async r => await userProfiles.putUser(r)));

fastify.get('/users/:username', async (req, reply) => 
  logged('Get User Profile By Username',
    req.params.username,
    async r => await userProfiles.getUserByUsername(r)));
    
fastify.get('/users/id/:userId', async (req, reply) => 
  logged('Get User Profile By Id',
    req.params.userId,
    async r => await userProfiles.getUserById(r)));

// Posts

fastify.post('/posts', async (req, reply) => 
  logged('Create/Update Post', 
    req.body, 
    async r => await posts.putPost(r)));

fastify.get('/posts/recent', async (req, reply) => 
  logged('Get Recent Posts',
  ({}),
  async r => await posts.getRecentPosts(20)));

// Framework

const logged = async (operation, req, getResp) => {
  const resp = await getResp(req);
  logReqResp(operation, req, resp);
  return resp;
};
const logReqResp = (operation, req, resp) => console.log('API Request -', { operation, req, resp });

const start = async () => {
  try {
    await fastify.listen(3000)
    fastify.log.info(`server listening on ${fastify.server.address().port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

exports.start = start;
# Communitize

Communitize is a pluggable technical community backend that can be added to an app. 

Currently, it is a Proof of Concept demo.

It is written in Node.js using Fastify and MongoDb.

## Current Features

### User Profiles
- Get User Profile
- Create User Profile
- Update User Profile

### Posts
- Add Post
- Get Recent Posts
- Score Post (+1/-1)
- Add Post Comment

## Future Possible Features

- Schema Validation
- Auth Integration
- Data Update Authorization
- OpenAPI Document for WebAPI

## Local Setup

1. Clone this repo
2. Set Environment Variable `CommunitizeMongoConnStr` with your MongoDB connection string
3. Run `npm run dev` 

## Usage

- Either use the provided Fastify WebAPI interface, when hosted
- Or use the 2 files `src/db/mongo-posts.js` and `src/db/mongo-userprofiles.js` embedded in your app

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)
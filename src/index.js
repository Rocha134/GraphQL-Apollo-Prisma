const Vote = require('./resolvers/Vote')

const Subscription = require('./resolvers/Subscription')

const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const User = require('./resolvers/User')
const Link = require('./resolvers/Link')

// ... previous import statements
const { PubSub } = require('apollo-server')
const pubsub = new PubSub()

const { ApolloServer } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');

// 1
const resolvers = {
  Query,
  Mutation,
  Subscription,
  User,
  Link,
  Vote,
}

const fs = require('fs');
const path = require('path');
const { info } = require('console');
const prisma = new PrismaClient();

// 3
const { getUserId } = require('./utils');

const server = new ApolloServer({
  typeDefs: fs.readFileSync(
    path.join(__dirname, 'schema.graphql'),
    'utf8'
  ),
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      pubsub,
      userId:
        req && req.headers.authorization
          ? getUserId(req)
          : null
    };
  }
});

server
  .listen()
  .then(({ url }) =>
    console.log(`Server is running on ${url}`)
  );
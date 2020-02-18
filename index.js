import {
    GraphQLServer, PubSub
} from 'graphql-yoga'
const fs = require('fs')
const resolvers = require("./resolver")
const typeDefs = fs.readFileSync("./schema.gql", "utf8")
const authorize = require("./src/auth").authorize
const helper = require('./src/context/db').helper

const pubsub = new PubSub()

const server = new GraphQLServer({
    typeDefs,
    resolvers,
    middlewares: [authorize],
    context: req => ({
        user: helper.getUser(req.request),
        pubsub
    }),
})

const options = {
    port: 4000,
    endpoint: '/graphql',
    subscriptions: '/subscriptions',
    playground: '/playground',
}

server.start(options, ({
        port
    }) =>
    console.log(
        `
🚢 Server started at http://localhost:${port} 
endpoint: http://localhost:${port}/graphql
subscriptions: http://localhost:${port}/subscriptions
playground: http://localhost:${port}/playground`,
    ),
)
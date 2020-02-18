const fs = require("fs");
const {
    makeExecutableSchema
} = require("graphql-tools");
const express = require("express");
const graphql = require("express-graphql");
const sofa = require("sofa-api");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const typeDefs = fs.readFileSync("./schema.gql", "utf8");
const resolvers = require("./resolver");

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});

const server = express();


const openApi = sofa.OpenAPI({
    schema,
    info: {
      title: 'Invest New Business App'
    }
  });


server.use("/graphql", graphql({
    schema,
    graphiql: true
}));

server.use("/rest",
    sofa.useSofa({
        schema,
        onRoute(info) {
            openApi.addRoute(info, {
                basePath: '/rest',
            });
        },
    })
);

// writes every recorder route
openApi.save('./swagger.json');

// expose rest docs
server.use("/rest", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

server.listen("4000");
// ! Don't fall in love with your code i now it hurts
const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');


const app = express();

app.use(bodyParser.json());

app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
        type RootQuery {
            events: [String!]!
        }

        type RootMutation {
            createEvenet(name: String!): String
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => { // ! this is a resolver
            return ['Romantic Cooking', 'Sailing', 'All Night Coding']
        },
        createEvenet: (args) => {
            const eventName = args.name;
            return eventName;
        }
    },
    graphiql: true
}));
// ? resovlers/ rootValue funtion needs to match our schema by name



app.listen(3000);
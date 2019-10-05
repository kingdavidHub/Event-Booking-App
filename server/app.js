// ! Don't fall in love with your code i now it hurts
const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');


const app = express();

const events  = [];

app.use(bodyParser.json());


//? Float adds a decimal number 2.0 not just a single number
app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
            type Event {
                _id: ID!
                title: String!
                description: String!
                price: Float!
                date: String!
            }

            input EventInput {
                title: String!
                description: String!
                price: Float!
                date: String!
            }

            type RootQuery {
                events: [Event!]!
            }

            type RootMutation {
                createEvent(eventInput: EventInput): Event
            }

            schema {
                query: RootQuery
                mutation: RootMutation
            }
        `),
        rootValue: {
            // ! this is a resolver
            events: () => {
                return events;
            },
            createEvent: (args) => {
                const event = {
                    _id: Math.random().toString(),
                    title: args.eventInput.title,
                    description: args.eventInput.description,
                    price: +args.eventInput.price,
                    date: new Date().toISOString()
                }
            
            events.push(event);
            return event;
            }
        },
        graphiql: true
    })
);
// ? resovlers/ rootValue funtion needs to match our schema by name



app.listen(3000);
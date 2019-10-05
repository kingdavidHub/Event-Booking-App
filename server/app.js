// ! Don't fall in love with your code i now it hurts
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
require('dotenv').config();
const mongoose = require('mongoose');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');


// * Mongoose Model
const Event = require('./models/event');


const app = express();


app.use(bodyParser.json());
app.use(morgan('dev'));
mongoose.connect(`mongodb+srv://${process.env.MONGO_ADMIN}:${process.env.MONGO_PW}@event-booking-app-cwpy7.mongodb.net/${process.env.MONGO_DB_SAVE}?retryWrites=true&w=majority`, 
{useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true});

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
            events: () => {
                return Event.find({})
                .then(events => {
                   return events.map(event => {
                       console.log(event);
                        return {...event._doc}  // ! copies the data Just Figure it out
                   });
                })
                .catch(err => {
                    console.log(err)
                    throw err;
                })
            },
            createEvent: (args) => {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date) // ! passing the incomming date string into the date object to be converted
            });
            return event
                .save()
                .then(result => {
                    console.log(result)
                    return {...result._doc} // ! returns the core properties of the data and set aside metadata
                })
                .catch(err => {
                    console.log(err)
                    throw err; // ! send the err to grahql
                });
            }
        },
        graphiql: true
    })
);
// ? resovlers/ rootValue funtion needs to match our schema by name



app.listen(3000);
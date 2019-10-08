// ! Don't fall in love with your code i now it hurts
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
require('dotenv').config();
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// * Mongoose Model
const Event = require('./models/event');
const User = require('./models/user');



const app = express();


app.use(bodyParser.json());
app.use(morgan('dev'));
mongoose.connect(`mongodb+srv://${process.env.MONGO_ADMIN}:${process.env.MONGO_PW}@event-booking-app-cwpy7.mongodb.net/${process.env.MONGO_DB_SAVE}?retryWrites=true&w=majority`, 
{useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true});

//  ? Float adds a decimal number 2.0 not just a single number
// ? never put a password as required because we don't want password to be public

app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
            type Event {
                _id: ID!
                title: String!
                description: String!
                price: Float!
                date: String!
            }

            type User {
                _id: ID!,
                email: String!
                password: String
            }

            input UserInput {
                email: String!
                password: String!
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
                createUser(userInput: UserInput): User
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
            let createdEvent;
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date), // ! passing the incomming date string into the date object to be converted
                creator: '5d9bd43cc222572578a74147'
            });
            return event // ? return promise not to get a straight result but a sync operation
                .save()
                .then(result => {
                    createdEvent =  { ...result._doc } // ! returns the core properties of the data and set aside metadata
                    return User.findById('5d9bd43cc222572578a74147') // ! return the user to this .then() func()
                })
                .then(user => {
                    if (!user) {
                        throw Error('User not found.');
                    }
                    user.createdEvents.push(event); // ? pushing event to the user model and it only stores the event ID
                    return user.save();
                })
                .then(result => {
                    console.log(result)
                    return createdEvent;
                })
                .catch(err => {
                    console.log(err)
                    throw err; // ! send the err to grahql
                });
            },
            createUser: (args) => {
            return  User.findOne({ email: args.userInput.email })
            .then(user => {
                if (user) {
                    throw Error('User exists already.');
                }
                return bcrypt
                .hash(args.userInput.password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        email: args.userInput.email,
                        password: hashedPassword
                    });
                    return user.save(); // ? return user to the async function
                })
                .then(result => {
                    return { ...result._doc, password: null }; // !changing the query password to null so when a query is created users can't see it
                })
                .catch(err => {
                    throw err
                });
            })
            }
        },
        graphiql: true
    })
);
// ? resovlers/ rootValue funtion needs to match our schema by name

app.listen(3000);
// ! Don't fall in love with your code i now it hurts
`use strict`;
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
require('dotenv').config();
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');

const graphqlSchema = require('./graphql/schema/index');
const graphqlResolvers = require('./graphql/resolvers/index');

const app = express();


app.use(bodyParser.json());
app.use(morgan('dev'));
mongoose.connect(`mongodb+srv://${process.env.MONGO_ADMIN}:${process.env.MONGO_PW}@event-booking-app-cwpy7.mongodb.net/${process.env.MONGO_DB_SAVE}?retryWrites=true&w=majority`, 
{useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true});

//  ? Float adds a decimal number 2.0 not just a single number
// ? never put a password as required because we don't want password to be public


app.use('/graphql', graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true
    })
);


app.listen(3000);
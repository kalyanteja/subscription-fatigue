const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
const buildSchema = require('./graphql/schemas/index');
const resolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/authchecker');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());

app.use(cors());

app.use(isAuth);

app.use('/graphql', graphqlHttp({
    schema: buildSchema,
    rootValue: resolvers,
    graphiql: true
}));

mongoose
    .connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PWD}@cluster0-fpxz8.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
    .then(() => {
        app.listen(8000);
    })
    .catch(err => {
        console.log(err);
    });

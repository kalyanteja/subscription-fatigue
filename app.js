const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const Subscription = require('./models/subscription');

const app = express();

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        type Subscription {
            _id: ID!
            name: String!
            companyId: Int!
            description: String
            period: String!
            date: String!
        }

        input SubscriptionInput {
            name: String!
            companyId: Int!
            description: String
            period: String!
            date: String
        }

        type RootQuery {
            subscriptions: [Subscription!]!
        }

        type RootMutation {
            addSubscription(subscriptionInput: SubscriptionInput): Subscription
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        subscriptions: () => {
            return Subscription
                .find()
                .then(subs => subs.map(sub => {
                    return { ...sub._doc };
                }))
                .catch(err => {
                    console.log(err);
                    throw err;
                });
        },
        addSubscription: (args) => {
            console.log(args.subscriptionInput);
            const subscription = new Subscription({
                name: args.subscriptionInput.name,
                companyId: args.subscriptionInput.companyId,
                description: args.subscriptionInput.description,
                period: args.subscriptionInput.period,
                date: new Date(args.subscriptionInput.date)
            });

            return subscription
                .save()
                .then(result => {
                    console.log(result);
                    return { ...result._doc };
                })
                .catch(err => {
                    console.log('save failed', err)
                    throw err;
                });
        }
    },
    graphiql: true
}));

mongoose
    .connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PWD}@cluster0-fpxz8.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
    .then(() =>{
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });

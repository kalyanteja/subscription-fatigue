const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Subscription = require('./models/subscription');
const User = require('./models/user');

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
            creator: String!
        }

        type User {
            _id: ID!,
            name: String!,
            email: String!,
            password: String
        }

        input UserInput {
            name: String!,
            email: String!,
            password: String!
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
            createUser(userInput: UserInput): User
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
            const subscription = new Subscription({
                name: args.subscriptionInput.name,
                companyId: args.subscriptionInput.companyId,
                description: args.subscriptionInput.description,
                period: args.subscriptionInput.period,
                date: new Date(args.subscriptionInput.date),
                creator: "5d1003b245c01225c436e2c4"
            });

            let createdSubscription;

            return subscription
                .save()
                .then(result => {
                    createdSubscription =  { ...result._doc };
                    // hardcoded for now, should be added later when integrated with Client
                    return User.findById('5d1003b245c01225c436e2c4')
                })
                .then(user => {
                    if(!user){
                        throw new Exception('User doenst exists');
                    }

                    user.createdSubscriptions.push(subscription);
                    return user.save();                    
                })
                .then(res => {
                    return createdSubscription;
                })
                .catch(err => {
                    console.log('save failed', err)
                    throw err;
                });
        },
        createUser: (args) => {
            return User.findOne({email: args.userInput.email})
                .then(user => {
                    if(user){
                        throw new Error('User already exists!')
                    }else{
                        return bcrypt.hash(args.userInput.password, 12)
                    }
                })
                .then(hashPwd => {
                    const user = new User({
                        name: args.userInput.name,
                        email: args.userInput.email,
                        password: hashPwd
                    });

                    return user.save();
                })
                .then(result => {
                    return { ...result._doc };
                })
                .catch(err => { 
                    throw err
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

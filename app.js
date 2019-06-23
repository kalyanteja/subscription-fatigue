const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

const subscriptions = [];

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
            return subscriptions;
        },
        addSubscription: (args) => {
            const subscription = {
                _id: Math.random().toString(),
                name: args.subscriptionInput.name,
                companyId: args.subscriptionInput.companyId,
                description: args.subscriptionInput.description,
                period: args.subscriptionInput.period,
                date: new Date().toISOString()
            };

            subscriptions.push(subscription);

            return subscription;
        }
    },
    graphiql: true
}));

app.listen(3000);
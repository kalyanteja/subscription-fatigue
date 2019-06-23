const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        type RootQuery {
            subscriptions: [String!]!
        }

        type RootMutation {
            addSubscription(name: String): String
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        subscriptions: () => {
            return ['Netflix', 'Spotify', 'HotStar'];
        },
        addSubscription: (args) => {
            const addedSubscription = args.name;
            return addedSubscription;
        }
    },
    graphiql: true
}));

app.listen(3000);
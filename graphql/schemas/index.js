const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type Subscription {
    _id: ID!
    name: String!
    companyId: Int!
    description: String
    period: String!
    date: String!
    creator: User!
}

type User {
    _id: ID!,
    name: String!,
    email: String!,
    password: String,
    createdSubscriptions: [Subscription!]
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
`);
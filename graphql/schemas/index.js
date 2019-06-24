const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type Subscription {
    _id: ID!
    name: String!
    company: Company!
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

type Company {
    _id: ID!,
    name: String!,
    description: String,
    isCustom: Boolean!,
    imgPath: String
}

input CompanyInput {
    name: String!,
    description: String,
}

input UserInput {
    name: String!,
    email: String!,
    password: String!
}

input SubscriptionInput {
    name: String!
    companyId: String!
    description: String
    period: String!
    date: String
}

type RootQuery {
    subscriptions: [Subscription!]!
    companies: [Company!]!
}

type RootMutation {
    addSubscription(subscriptionInput: SubscriptionInput): Subscription
    createUser(userInput: UserInput): User
    addCompany(companyInput: CompanyInput): Company
    removeSubscription(id: String): String
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);
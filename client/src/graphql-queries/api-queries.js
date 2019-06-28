const subscriptionsQuery = `
    query {
        subscriptions {
            name,
            company {
                name,
                _id
            },
            period,
            date,
            _id
        }
    }
`;

const companiesQuery = `
    query {
        companies {
        _id,
        name
        }
    }
`;

const getAddNewOrEditSubscriptionQuery = (name, companyId, period, date, id) => `
    mutation {
        addSubscription(subscriptionInput: { name : "${name}", companyId: "${companyId}", description: "", period: "${period}", date: "${date}", id: "${id}"}){
        _id
        }
    }
`;

const removeQuery = (subscriptionId) => `
    mutation {
        removeSubscription(id: "${subscriptionId}")
    }
`;

const graphQlRequestWithToken = (reqBody, token) => {
    return fetch('http://localhost:8000/graphql', {
        method: 'POST',
        body: JSON.stringify({ query : reqBody}),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
}

exports.SubscriptionsQuery = subscriptionsQuery;
exports.CompaniesQuery = companiesQuery;
exports.AddNewOrEditSubscriptionQuery = getAddNewOrEditSubscriptionQuery;
exports.RemoveQuery = removeQuery;
exports.GraphQlRequestWithToken = graphQlRequestWithToken;
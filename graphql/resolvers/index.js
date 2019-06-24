const userResolver = require('./user');
const subscriptionResolver = require('./subscription');
const companyResolver = require('./company');

const rootResolver = {
    ...userResolver,
    ...subscriptionResolver,
    ...companyResolver
};

module.exports = rootResolver;
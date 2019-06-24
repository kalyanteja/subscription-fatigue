const Subscription = require('../../models/subscription');
const User = require('../../models/user');
const Company = require('../../models/company');
const { dateToString } = require('../../helpers/date');

const user = userId => {
    return User.findById(userId)
        .then(user => {
            return { ...user._doc, createdSubscriptions: subscriptions.bind(this, user.createdSubscriptions) };
        })
        .catch(err => {
            throw err;
        })
}

const company = companyId => {
    return Company.findById(companyId)
        .then(company => {
            return { ...company._doc };
        })
        .catch(err => {
            throw err;
        })
}

const subscriptions = subscriptionIds => {
    return Subscription.find({ _id: { $in: subscriptionIds }})
        .then(subscriptions => {
            return subscriptions.map(sub => {
                return {
                    ...sub,
                    creator: user.bind(this, sub.creator),
                    date: dateToString(sub._doc.date)
                };
            });
        })
        .catch(err => {
            throw err;
        });
}

const transformSubscription = subscription => {
    return { 
        ...subscription._doc,
        creator: user.bind(this, subscription._doc.creator),
        date: dateToString(subscription._doc.date),
        company: company.bind(this, subscription._doc.company)
    }
}

exports.user = user;
exports.subscriptions = subscriptions;
exports.company = company;
exports.transformSubscription = transformSubscription;
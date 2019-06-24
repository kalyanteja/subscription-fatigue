const Subscription = require('../../models/subscription');
const User = require('../../models/user');

const { transformSubscription } = require('../resolvers/common');

module.exports = {
    subscriptions: () => {
        return Subscription
            .find()
            //.populate('creator')
            .then(subs => subs.map(subscription => {
                return transformSubscription(subscription);
            }))
            .catch(err => {
                console.log(err);
                throw err;
            });
    },
    addSubscription: (args) => {
        const subscription = new Subscription({
            name: args.subscriptionInput.name,
            company: args.subscriptionInput.companyId,
            description: args.subscriptionInput.description,
            period: args.subscriptionInput.period,
            date: new Date(args.subscriptionInput.date),
            creator: "5d10049631287529bc733a53"
        });

        let createdSubscription;

        return subscription
            .save()
            .then(result => {
                createdSubscription = transformSubscription(result);
                // hardcoded for now, should be added later when integrated with Client
                return User.findById('5d10049631287529bc733a53')
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
    removeSubscription: async args => {
        subscriptionId = args.id;

        try {
            const subscription = await Subscription.findById(subscriptionId).populate('Company');

            await Subscription.deleteOne(subscription);
            return `Removed ${subscription._doc.name} Subscription!`;
        } catch (error) {
            throw error;
        }
    }
}
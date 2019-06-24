const Subscription = require('../../models/subscription');
const User = require('../../models/user');

const { transformSubscription } = require('../resolvers/common');

module.exports = {
    subscriptions: (args, req) => {
        if(!req.isAuth){
            throw new Error("User not authenticated!");
        }

        return Subscription
            .find()
            .then(subs => subs.map(subscription => {
                return transformSubscription(subscription);
            }))
            .catch(err => {
                throw err;
            });
    },
    addSubscription: (args, req) => {
        if(!req.isAuth){
            throw new Error("User not authenticated!");
        }

        const userId = req.userId;

        const subscription = new Subscription({
            name: args.subscriptionInput.name,
            company: args.subscriptionInput.companyId,
            description: args.subscriptionInput.description,
            period: args.subscriptionInput.period,
            date: new Date(args.subscriptionInput.date),
            creator: userId
        });

        let createdSubscription;

        return subscription
            .save()
            .then(result => {
                createdSubscription = transformSubscription(result);
                return User.findById(userId);
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
                throw err;
            });
    },
    removeSubscription: async (args, req) => {
        if(!req.isAuth){
            throw new Error("User not authenticated!");
        }

        const subscriptionId = args.id;

        try {
            const subscription = await Subscription.findById(subscriptionId).populate('Company');

            await Subscription.deleteOne(subscription);
            return `Removed ${subscription._doc.name} Subscription!`;
        } catch (error) {
            throw error;
        }
    }
}
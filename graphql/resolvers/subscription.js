const Subscription = require('../../models/subscription');
const User = require('../../models/user');

const { transformSubscription } = require('../resolvers/common');

module.exports = {
    subscriptions: (args, req) => {
        if(!req.isAuth){
            throw new Error("User not authenticated!");
        }

        return Subscription
            .find({creator: req.userId})
            .then(subs => subs.map(subscription => {
                return transformSubscription(subscription);
            }))
            .catch(err => {
                throw err;
            });
    },
    addSubscription: async (args, req) => {
        if(!req.isAuth){
            throw new Error("User not authenticated!");
        }

        const userId = req.userId;
        const subscriptionId = args.subscriptionInput.id;
        const editSubscription = subscriptionId != null && subscriptionId !== "";
        try {
            let subscription;
            if (editSubscription) {
                subscription = await Subscription.findById(args.subscriptionInput.id);
                subscription.name = args.subscriptionInput.name;
                subscription.company = args.subscriptionInput.companyId;
                subscription.description = args.subscriptionInput.description;
                subscription.period = args.subscriptionInput.period;
                subscription.date = new Date(args.subscriptionInput.date);
            }else {
                subscription = new Subscription({
                    name: args.subscriptionInput.name,
                    company: args.subscriptionInput.companyId,
                    description: args.subscriptionInput.description,
                    period: args.subscriptionInput.period,
                    date: new Date(args.subscriptionInput.date),
                    creator: userId
                })
            }

            const result = await subscription.save()
            const createdSubscription = transformSubscription(result);
            
            if (!editSubscription){
                const user = await User.findById(userId);
            
                if(!user){
                    throw new Exception('User doenst exists');
                }

                user.createdSubscriptions.push(subscription);
                await user.save();
            }
            
            return createdSubscription;

        } catch (error) {
            throw error;
        }
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
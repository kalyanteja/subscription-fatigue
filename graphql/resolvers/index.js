const bcrypt = require('bcryptjs');

const Subscription = require('../../models/subscription');
const User = require('../../models/user');

const user = userId => {
    return User.findById(userId)
        .then(user => {
            return { ...user._doc, createdSubscriptions: subscriptions.bind(this, user.createdSubscriptions) };
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
                    date: new Date(sub._doc.date).toISOString()
                };
            });
        })
        .catch(err => {
            throw err;
        });
}

module.exports = {
    subscriptions: () => {
        return Subscription
            .find()
            //.populate('creator')
            .then(subs => subs.map(sub => {
                return { 
                    ...sub._doc,
                    creator: user.bind(this, sub._doc.creator),
                    date: new Date(sub._doc.date).toISOString()
                };
            }))
            .catch(err => {
                console.log(err);
                throw err;
            });
    },
    addSubscription: (args) => {
        const subscription = new Subscription({
            name: args.subscriptionInput.name,
            companyId: args.subscriptionInput.companyId,
            description: args.subscriptionInput.description,
            period: args.subscriptionInput.period,
            date: new Date(args.subscriptionInput.date),
            creator: "5d10049631287529bc733a53"
        });

        let createdSubscription;

        return subscription
            .save()
            .then(result => {
                createdSubscription =  { ...result._doc, creator: user.bind(this, result._doc.creator), date: new Date(result._doc.date).toISOString() };
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
    createUser: (args) => {
        return User.findOne({email: args.userInput.email})
            .then(user => {
                if(user){
                    throw new Error('User already exists!')
                }else{
                    return bcrypt.hash(args.userInput.password, 12)
                }
            })
            .then(hashPwd => {
                const user = new User({
                    name: args.userInput.name,
                    email: args.userInput.email,
                    password: hashPwd
                });

                return user.save();
            })
            .then(result => {
                return { ...result._doc };
            })
            .catch(err => { 
                throw err
            });
    }
};
const bcrypt = require('bcryptjs');
const User = require('../../models/user');

module.exports = {
    createUser: (args) => {
        console.log(args.userInput);
        return User.findOne({email: args.userInput.email})
            .then(user => {
                console.log(user);
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
                return { 
                    ...result._doc
                };
            })
            .catch(err => { 
                throw err
            });
    }
};
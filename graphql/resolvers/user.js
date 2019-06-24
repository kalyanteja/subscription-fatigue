const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');

module.exports = {
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
                return { 
                    ...result._doc
                };
            })
            .catch(err => { 
                throw err
            });
    },
    login: async ({ email, password }) => {
        const user = await User.findOne({ email: email });
        if(!user){
            throw new Error("User doesn't exists!");
        }

        const arePasswordsSame = await bcrypt.compare(password, user.password);

        if(!arePasswordsSame){
            throw new Error("Please check your password!");
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email }, 
            "secretOrPrivateKey", 
            { expiresIn: "1h" }
        );

        return {
            userId: user.id,
            userName: user.name,
            token,
            tokenExpiration: 1
        };
    }
};
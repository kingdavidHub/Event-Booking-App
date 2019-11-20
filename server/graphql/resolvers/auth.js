const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// * Mongoose Model
const User = require('../../models/user');


module.exports = {
    createUser: async args => {
        try {
            const existingUser = await User.findOne({ email: args.userInput.email })
            if (existingUser) throw new Error('User exists already.')

            const hashedPassword = await bcrypt.hash(args.userInput.password, 12)

            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            });

            const result = await user.save();
            return { ...result._doc, password: null };
        } catch (err) {
            throw err;
        }
    },
    login: async ({email, password}) => {
            const user = await User.findOne({ email: email });
            if (!user) {
                // throw new Error(`User does not exist`);
                throw new Error(`Invalid Credentials`);
            }
        
            const isEqual = await bcrypt.compare(password, user.password);
            if (!isEqual) {
                // throw new Error(`Password is incorrect!`);
                 throw new Error(`Invalid Credentials`);
            }
            const token =  jwt.sign(
                { userId: user.id, email: user.email }, // ? data we want to put in the token
                'somesupersecretkey', {expiresIn: '1h'});

        return { userId: user.id, token: token, tokenExpiration: 1 };     
    }
};

/**
 * 1. VALIDATE IF EMAIL AND PASSWORD IS CORRECT
 * 2. // ?You can also use a token to store data in it
 */
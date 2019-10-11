const bcrypt = require('bcryptjs');

// * Mongoose Model
const Event = require('../../models/event');
const User = require('../../models/user');


const events = async (eventIds) => {
    try {
        // * $in ## finds all the id in the array documnet
        const events = await Event.find({ _id: { $in: eventIds } })
        events.map(event => {
            return {
                ...event._doc,
                _id: event.id,
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event.creator)
            };
        });
        return events;
    } catch(err) {
        throw err
    }
}


const user = async (userId) => {
    try {
        const user = await  User.findById(userId)
        return {
            ...user._doc,
            createdEvents: events.bind(this, user._doc.createdEvents)
        };
    } catch (err) {
        throw err;
    }
}


module.exports = {
    events: async () => {
        try {
            const events = await Event.find({}) //!note : => my event const was wrong
            return events.map(event => {
                return {
                    ...event._doc,
                    _id: event.id,
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, event._doc.creator)
                    // ? user is pointing to the global user const variable
                    // ?event._doc.creator holds the id and it is being passed to the user()
                }
            });
        } catch (err) {
            throw err
        }
    },

    createEvent: async args => {
        const event =  new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: '5d9bd43cc222572578a74147'
        });

        let createdEvent;
        try {
            const result = await event.save();
            createdEvent = {
                ...result._doc,
                _id: result._doc._id.toString(),
                date: new Date(result._doc.date).toISOString(),
                creator: user.bind(this, result._doc.creator) // !Note 
            };

            const creator = await User.findById('5d9bd43cc222572578a74147');
            if (!creator) {
                throw new Error('User not found.');
            }
            // * Push the event to the user model DB
            creator.createdEvents.push(event);
            await creator.save();

            return createdEvent;
        } catch (err) {
            throw err;
        }
    },

    createUser: (args) => {
        return User.findOne({ email: args.userInput.email })
            .then(user => {
                if (user) throw new Error('User exists already.')
                return bcrypt
                    .hash(args.userInput.password, 12)
                    .then(hashedPassword => {
                        const user = new User({
                            email: args.userInput.email,
                            password: hashedPassword
                        });
                        return user.save();
                    })
                    .then(result => {
                        return { ...result._doc, password: null };
                    })
                    .catch(err => {
                        throw err
                    });
            })
    }
};
const Event = require('../../models/event');
const User = require('../../models/user');
const { dateToString } = require('../../helpers/date');
const { transformedEvent } = require('./mergeData');


module.exports = {
    // * QUERIES
    events: async () => {
        try {
            const events = await Event.find({}) //!note : => my event const was wrong
            return events.map(event => {
                return transformedEvent(event);
            });
        } catch (err) {
            throw err
        }
    },

    // * MUTATION //! Getting acces of our req.Header()
    createEvent: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated'); //! getting it from the isAuth() middleware
        }
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: dateToString(args.eventInput.date),
            creator: req.userId
        });

        let createdEvent;
        try {
            const result = await event.save();
            createdEvent = transformedEvent(result);

            const creator = await User.findById(req.userId);
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
    }
};
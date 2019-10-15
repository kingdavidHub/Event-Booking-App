const Event = require('../../models/event');
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

    // * MUTATION
    createEvent: async args => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: dateToString(args.eventInput.date),
            creator: '5d9bd43cc222572578a74147'
        });

        let createdEvent;
        try {
            const result = await event.save();
            createdEvent = transformedEvent(result);

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
    }
};
const Event = require('../../models/event');
const Booking = require('../../models/booking');
const { transformedBooking, transformedEvent } = require('./mergeData');

module.exports = {
    bookings: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated'); //! getting it from the isAuth() middleware
        }
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return transformedBooking(booking);
            });
        } catch (err) {
            throw err;
        }
    },
    bookEvent: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated'); //! getting it from the isAuth() middleware
        }
        const fetchedEvent = await Event.findOne({ _id: args.eventId });

        const booking = new Booking({
            user: req.userId,
            event: fetchedEvent
        });
        const result = await booking.save();
        return transformedBooking(result);
    },

    cancelBooking: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated'); //! getting it from the isAuth() middleware
        }
        try {
            const booking = await Booking
                .findById(args.bookingId)
                .populate('event')

            const event = transformedEvent(booking.event);
            //? ascessing the populated data

            console.log(event);
            await Booking.deleteOne({ _id: args.bookingId });
            return event;
        } catch (error) {
            throw error;
        }
    }
};
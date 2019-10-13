const bcrypt = require('bcryptjs');

// * Mongoose Model
const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');

// ? Manual qeury for flexible drilling of other ref datas

const events = async (eventIds) => {
    try {
        // * $in ## finds all the id in the array documnet
        const events = await Event.find({ _id: { $in: eventIds } })
        events.map(event => {
            return {
                ...event._doc,
                _id: event.id,
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event._doc.creator)
            };
        });
        return events;
    } catch (err) {
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

const singleEvent = async eventId => {
  try {
    const event = await Event.findById(eventId);
    return {
      ...event._doc,
      creator: user.bind(this, event._doc.creator)
    };
  } catch (err) {
    throw err;
  }
};

module.exports = {
    // * QUERIES
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

    bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map(booking => {
        return {
          ...booking._doc,
          user: user.bind(this, booking._doc.user),
          event: singleEvent.bind(this, booking._doc.event),
          createdAt: new Date(booking._doc.createdAt).toISOString(),
          updatedAt: new Date(booking._doc.updatedAt).toISOString()
        };
      });
    } catch (err) {
      throw err;
    }
  },
    
    // * MUTATION
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
    bookEvent: async args => {
        const fetchedEvent = await Event.findOne({_id: args.eventId});

        const booking = new Booking({
           user: '5d9bd43cc222572578a74147',
           event: fetchedEvent 
        });
        const result = await booking.save();
        return {
             ...result._doc, 
            user: user.bind(this, result._doc.user),
            event: singleEvent.bind(this, result._doc.event),
            createdAt: new Date(result._doc.createdAt).toISOString(),
            updatedAt: new Date(result._doc.updatedAt).toISOString()
        };
    },

    cancelBooking: async args => {
        try {
            const booking = await Booking
            .findById(args.bookingId)
            .populate('event')
            
            const event = {
                 ...booking.event._doc,
                  creator: user.bind(this, booking.event._doc.creator)
                } //? ascessing the populated data

            console.log(event);
            await Booking.deleteOne({_id: args.bookingId});
            return event;
        } catch (error) {
            throw error;
        }
    }
};
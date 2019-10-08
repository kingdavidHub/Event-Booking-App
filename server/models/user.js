const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdEvents: [
        {
            type: Schema.Types.ObjectId,  // ! get the generated that mongodb provides
            ref: 'Event'   // ? This notifies mongoose to refrence another models in our App which is the Event.js
        }
    ]
});


module.exports = mongoose.model('User', userSchema);
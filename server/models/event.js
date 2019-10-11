const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        require: true
    },
    date: {
        type: Date,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User' // ? stop objectId of the user
    }
});


module.exports = mongoose.model('Event', eventSchema);
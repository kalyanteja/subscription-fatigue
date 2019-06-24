const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const subscriptionSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    },
    description: {
        type: String,
        required: false
    },
    period: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
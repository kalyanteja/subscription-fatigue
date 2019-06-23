const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const subscriptionSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    companyId: {
        type: Number,
        required: true
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
    }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
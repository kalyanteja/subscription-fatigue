const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const companySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    isCustom: {
        type: Boolean,
        required: true
    },
    imgPath: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Company', companySchema);
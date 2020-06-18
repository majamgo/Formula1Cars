const mongoose = require('mongoose');


const carSchema = new mongoose.Schema({
    car: {
        type: String,
        required: true
    },
    team: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    motor: {
        type: String,
        required: true
    }
}, { timestamps: true });


module.exports = mongoose.model('Car', carSchema);
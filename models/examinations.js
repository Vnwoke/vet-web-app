const mongoose = require('mongoose')

var pet= new mongoose.Schema({
    pet: mongoose.SchemaTypes.ObjectId, ref:Pet
    doctor: mongoose.SchemaTypes.ObjectId, ref: User,
    date: Date, default: Date.now,
    notes: String,
    diagnosis: String,
    treatment: String
}, {collection: 'examinations'})

const User = mongoose.model('Examination', examination)

module.exports = Examination

const mongoose = require('mongoose')

var pet= new mongoose.Schema({
    name: String,
    breed: String,
    age: Number,
    owner: mongoose.SchemaTypes.ObjectId, ref: User

}, {collection: 'pets'})

const User = mongoose.model('Pet', pet)

module.exports = Pet
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const User = require('../models/user');

let Schema = mongoose.Schema;

let categorySchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'El nombre es necesario']
    },
    // user: {
    //     type: User
    // }
});

categorySchema.plugin(uniqueValidator, {message: '{PATH} debe ser unico'});

module.exports = mongoose.model('Category', categorySchema);




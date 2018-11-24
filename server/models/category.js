const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;

let categorySchema = new Schema({
    description: {
        type: String,
        unique: true,
        required: [true, 'El descripción es obligatoria']
    },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});

categorySchema.plugin(uniqueValidator, {message: '{PATH} debe ser unico'});

module.exports = mongoose.model('Category', categorySchema);



const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name 😒']
    },

    email: {
        type: String,
        required: [true, 'Please provide your email!!'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide valid email address!']
    },

    photo: String,
    
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8
    },

    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password ']
    }

});

const User = mongoose.model('User', userSchema);

module.exports = User;
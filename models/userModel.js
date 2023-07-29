const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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

    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default:'user'
    },
    
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select:false
    },

    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password '],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message:"Passwords are not the same"
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires:Date

});

userSchema.pre('save', async function (next) {
    //Only runs  this function if the password is modified
    if (!this.isModified('password')) return next();

    //Hash the password with 12 CPU cost
    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
    if (this.passwordChangedAt) {
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        console.log(changedTimeStamp, JWTTimeStamp);
        return JWTTimeStamp < changedTimeStamp;
    }

    return false;
    
}

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    console.log({ resetToken }, this.passwordResetToken);

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;

}

const User = mongoose.model('User', userSchema);

module.exports = User;
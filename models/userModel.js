const crypto = require('crypto')
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true, // It's not a validator, will transform email to lowercase
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: String,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false    // prevent the password from showing when get the user data
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            // This only works on CREATE and SAVE
            validator: function (el) {
                return el === this.password
            }
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false   // We do not want to leak the active field to the user
    }
})

// Document middleware: between getting data and saving it to the database
userSchema.pre('save', async function (next) {
    // "this" point to the document
    if (!this.isModified('password')) {
        return next()
    }
    // need to await, or else the password cannot encrypted
    this.password = await bcrypt.hash(this.password, 12)
    // we don't need to save passwordConfirm saved to the document
    this.passwordConfirm = undefined
    next()
})


userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex')

    // Note: resetToken like the password, so we need to encrypt
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000

    return resetToken
}
const User = mongoose.model('User', userSchema)

module.exports = User
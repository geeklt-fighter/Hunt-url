const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

const signToken = id => {
    return jwt.sign({ id: id }
        , process.env.JWT_SECRET
        , { expiresIn: process.env.JWT_EXPIRES_IN })
}



exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create(req.body)

    const token = signToken(newUser._id)
    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    })
})


exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400))
    }

    // Becuase password's select in user model is false
    const user = await User.findOne({ email: email }).select('+password')

    const correct = await user.correctPassword(password, user.password)

    if (!user || !correct) {
        return next(new AppError('Incorrect email or password', 401))
    }

    const token = signToken(user._id)
    res.status(200).json({
        status: 'success',
        token
    })
})
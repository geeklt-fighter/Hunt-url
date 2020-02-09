const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const sendEmail = require('../utils/email')
const crypto = require('crypto')

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


exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1) get the user based on the email
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return next(new AppError('There is no user with email address', 404))
    }
    //*2) generate the reset token
    const resetToken = user.createPasswordResetToken()
    // because we define passwordConfirm is required, so we need to let it functionless temporarily
    await user.save({ validateBeforeSave: false })

    // 3) send mail
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`
    const message = `Forget your password? Submit a patch request with your new password and
        passwordConfirm to: ${resetURL}. \n If you did not forget password, please ignore this email`

    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 minutes)',
            message
        })

        res.status(200).json({
            status: 'success',
            message: 'Token sent to email ~'
        })
    } catch (err) {
        // if something error, we need to delete the resettoken save in the database
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined
        await user.save({ validateBeforeSave: false })

        return next(new AppError('There was an error sending email. Try again later !'))
    }
})


exports.resetPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on the token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    // 1.a) Find the same encrypted resetToken and ensure that token has not expired
    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gte: Date.now() } })
    console.log(user)
    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400))
    }

    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()

    const token = signToken(user._id)
    res.status(200).json({
        status: 'success',
        token
    })
})
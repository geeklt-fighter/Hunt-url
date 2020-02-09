const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

const filterObj = (obj, ...allowedFields) => {
    const newObj = {}
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) {
            newObj[el] = obj[el]    // {key: el, value: obj[el]} 
        }
    })
    return newObj
}

exports.updateMe = catchAsync(async (req, res, nex) => {
    // 1) Create error if user want to update password
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for the password update, please use /updateMyPassword route'))
    }

    // We do not update everythig in the req.body
    const filteredBody = filterObj(req.body, "name", "email")
    const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, { new: true, runValidators: true })

    res.status(200).json({
        status: 'success',
        data: {
            user: updateUser
        }
    })
})

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id
    next()
}

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false })

    res.status(204).json({
        status: 'success',
        data: null
    })
})


exports.getUser = catchAsync(async (req, res, next) => {
    let query = User.findById(req.params.id)

    const doc = await query
    if (!doc) {
        return next(new AppError('No document found with that ID', 404))
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        }
    })
})
const User = require('../models/userModel')
const Post = require('../models/postModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')



exports.getOverview = catchAsync(async (req, res) => {
    const posts = await Post.find()

    res.status(200).render('overview', {
        title: 'All Post',
        posts
    })
})


exports.getLoginForm = (req, res) => {
    res.status(200).render('login', {
        title: 'Log into your account'
    })
}


exports.getPost = catchAsync(async (req, res, next) => {
    const post = await Post.findOne({ slug: req.params.slug })

    if (!post) {
        return next(new AppError('There is no post with that name', 404))
    }

    res.status(200).render('post', {
        post
    })
})


exports.getAccount = (req, res) => {
    res.status(200).render('account', {
        title: 'Your account'
    })
}


exports.updateUserData = catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(req.user.id, {
        name: req.body.name,
        email: req.body.email
    }, {
        new: true,
        runValidators: true
    })

    res.status(200).render('account', {
        user: updatedUser
    })
})
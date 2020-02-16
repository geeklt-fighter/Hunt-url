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

exports.getAccount = (req, res) => {

}
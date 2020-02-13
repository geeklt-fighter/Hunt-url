const Post = require('../models/postModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')


exports.getAllPosts = catchAsync(async (req, res, next) => {

    const posts = await Post.find()

    res.status(200).json({
        status: 'success',
        results: posts.length,
        data: {
            posts
        }
    })
})

exports.getPost = catchAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.id)

    if (!post) {
        return next(new AppError('No post found with that ID', 404))
    }

    res.status(200).json({
        status: 'success',
        data: {
            post
        }
    })
})


exports.createPost = catchAsync(async (req, res, next) => {
    const newPost = await Post.create(req.body)
    res.status(201).json({
        status: 'success',
        data: {
            post: newPost
        }
    })
})


exports.updatePost = catchAsync(async (req, res, next) => {
    

    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    
    // protect the user's specific post
    if (post.poster.toString() !== req.user.id.toString()) {
        return next(new AppError('You are not the owner of this post',403))
    }
    res.status(200).json({
        status: 'success',
        data: {
            post: 'Update something'
        }
    })
})


exports.deletePost = catchAsync(async (req, res, next) => {
    const post = await Post.findByIdAndDelete(req.params.id)


    if (!post) {
        return next(new AppError('No post found with that id', 404))
    }

    // protect the user's specific post
    if (post.poster.toString() !== req.user.id.toString()) {
        return next(new AppError('You are not the owner of this post',403))
    }

    res.status(204).json({
        status: 'success',
        data: null
    })
})
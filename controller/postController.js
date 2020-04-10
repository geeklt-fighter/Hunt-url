const multer = require('multer')
const sharp = require('sharp')
const azureStorage = require('azure-storage')
const getStream = require('into-stream')
const Post = require('../models/postModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

// Get the azure blob storage connection string
const { AZURE_CSTRING_DEV } = process.env

const blobService = azureStorage.createBlobService(AZURE_CSTRING_DEV)
const multerStorage = multer.memoryStorage()

const containerName = 'user-porfolio'

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new AppError('Not an image! Please upload only an image', 404), false)
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})

exports.uploadPostImages = upload.fields([
    { name: 'mediaResource', maxCount: 1 }
])

exports.resizePostImages = catchAsync(async (req, res, next) => {
    if (!req.files.mediaResource) {
        return next()
    }
    
    req.body.mediaResource = `post-${req.params.id}-${Date.now()}-cover.jpeg`

    await sharp(req.files.mediaResource[0].buffer)
        .resize(1980, 1280)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/images/posts/${req.body.mediaResource}`)

    next()
})

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
        return next(new AppError('You are not the owner of this post', 403))
    }
    res.status(200).json({
        status: 'success',
        data: {
            post: 'Update something'
        }
    })
})


exports.deletePost = catchAsync(async (req, res, next) => {
    console.log(req.params.id)
    const post = await Post.findByIdAndDelete(req.params.id)


    if (!post) {
        return next(new AppError('No post found with that id', 404))
    }

    // protect the user's specific post
    if (post.poster.toString() !== req.user.id.toString()) {
        return next(new AppError('You are not the owner of this post', 403))
    }

    res.status(204).json({
        status: 'success',
        data: null
    })
})
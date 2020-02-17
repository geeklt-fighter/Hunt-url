const express = require('express')
const router = express.Router()
const { getAllPosts, getPost, createPost, updatePost, deletePost } = require('../controller/postController')
const { protect, restrictOwner } = require('../controller/authController')




router
    .route('/')
    .get(getAllPosts)
    .post(protect, createPost)

router
    .route('/:id')
    .get(getPost)
    .patch(protect, restrictOwner, updatePost)
    .delete(protect,restrictOwner, deletePost)


module.exports = router
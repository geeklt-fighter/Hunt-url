const express = require('express')
const router = express.Router()
const { getOverview, getLoginForm, getSignupForm, getAccount, getPost, updateUserData, getMyPost,deletePost } = require('../controller/viewController')
const { protect, loggedIn,restrictOwner } = require('../controller/authController')

router.get('/', loggedIn, getOverview)
router.get('/login', getLoginForm)
router.get('/signup', getSignupForm)
router.get('/post/:slug', loggedIn, getPost)
router.get('/me', protect, getAccount)
router.get('/posts', protect, getMyPost)

router.get('/submit-user-data', protect, updateUserData)




module.exports = router
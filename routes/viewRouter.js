const express = require('express')
const router = express.Router()
const { getOverview, getLoginForm, getAccount, getPost, updateUserData } = require('../controller/viewController')
const { protect, loggedIn } = require('../controller/authController')

router.get('/', loggedIn, getOverview)
router.get('/login', loggedIn, getLoginForm)
router.get('/post/:slug', loggedIn, getPost)
router.get('/me', protect, getAccount)

router.get('/submit-user-data', protect, updateUserData)

module.exports = router
const express = require('express')
const router = express.Router()
const { getOverview, getLoginForm, getAccount, getPost, updateUserData } = require('../controller/viewController')
const { protect } = require('../controller/authController')

router.get('/', getOverview)
router.get('/login', getLoginForm)
router.get('/post/:slug', getPost)
router.get('/me', protect, getAccount)

router.get('/submit-user-data', protect, updateUserData)

module.exports = router
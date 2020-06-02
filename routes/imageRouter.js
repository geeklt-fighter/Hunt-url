const express = require('express')
const router = express.Router()
const { getUserSasUrl, getPostSasUrl, updateUserSasUrl } = require('../controller/imageController')
const { protect } = require('../controller/authController')

router.post('/user', protect, getUserSasUrl)

module.exports = router
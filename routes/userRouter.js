const express = require('express')
const { signup, login } = require('../controller/authController')
const router = express.Router()


router.post('/signup', signup)
router.post('/login', login)
// router.get('/logout')


// router.post('/forgotPassword')
// router.patch('/resetPassword/:token')



module.exports = router
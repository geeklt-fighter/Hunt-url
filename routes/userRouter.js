const express = require('express')
const { signup, login, forgotPassword, resetPassword, protect, updatePassword } = require('../controller/authController')
const { getMe, getUser, updateMe, deleteMe } = require('../controller/userController')
const router = express.Router()


router.post('/signup', signup)
router.post('/login', login)
// router.get('/logout')

router.post('/forgotPassword', forgotPassword)
router.post('/resetPassword/:token', resetPassword)

// This will basically prtect all the routes come after this middleware
router.use(protect)

router.patch('/updatePassword', updatePassword)
router.get('/me', getMe, getUser)
router.delete('/deleteMe', deleteMe)
router.patch('/updateMe', updateMe)


module.exports = router
const express = require('express')
const router = express.Router()
const { getOverview, getLoginForm, getAccount, getPost } = require('../controller/viewController')

router.get('/', getOverview)
router.get('/login', getLoginForm)
router.get('/me', getAccount)
router.get('/post/:slug', getPost)

module.exports = router
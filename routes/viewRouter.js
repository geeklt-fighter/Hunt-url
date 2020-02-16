const express = require('express')
const router = express.Router()
const { getOverview, getLoginForm, getAccount } = require('../controller/viewController')

router.get('/', getOverview)
router.get('/login', getLoginForm)
router.get('/me', getAccount)

 
module.exports = router
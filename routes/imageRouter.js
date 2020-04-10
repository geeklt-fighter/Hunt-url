const express = require('express')
const router = express.Router()
const { getSasUrl } = require('../controller/imageController')
const { protect } = require('../controller/authController')

router.post('/resource',protect, getSasUrl)


module.exports = router
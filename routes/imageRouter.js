const express = require('express')
const router = express.Router()
const { getSasUrl } = require('../controller/imageController')

router.post('/resource', getSasUrl)


module.exports = router
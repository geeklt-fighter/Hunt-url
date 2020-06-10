const express = require('express')
const router = express.Router()
const { getRecentHistories, processHistories } = require('../controller/historyController')
const { protect } = require('../controller/authController')

router
    .route('/')
    .post(protect, processHistories)




module.exports = router
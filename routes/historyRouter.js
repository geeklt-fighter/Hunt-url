const express = require('express')
const router = express.Router()
const { getRecentHistories } = require('../controller/historyController')

router
    .route('/')
    .get(getRecentHistories)




module.exports = router
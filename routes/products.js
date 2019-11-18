const express = require('express');
const router = express.Router();
const multer = require('multer')
const inMemoryStorage = multer.memoryStorage()
const uploadStrategy = multer({ storage: inMemoryStorage }).single('image')
const azureStorage = require('azure-storage')
const { AZURE_CONNECTION_STRING } = process.env
const blobService = azureStorage.createBlobService(AZURE_CONNECTION_STRING)
const getStream = require('into-stream')
const containerName = 'timloimage'

let Product = require('../models/Products')


const getBlobName = originalName => {
    const identifier = Math.random().toString().replace(/0\./, '')
    return `${identifier}-${originalName}`
}


// Load the add_product.ejs page
router.get('/add', (req, res) => {
    res.render('add_product')
})


// Process the add 
router.post('/add', uploadStrategy, (req, res) => {
    let product = new Product()
    product.name = req.body.name
    product.advisor = req.body.advisor
    product.description = req.body.description

    console.log(req.file.originalname)
    const blobName = getBlobName(req.file.originalname)
    const stream = getStream(req.file.buffer)
    const streamLength = req.file.buffer.length

    blobService.createBlockBlobFromStream(containerName, blobName, stream, streamLength, err => {
        if (err) {
            res.status(500)
            console.log('error')
            return
        }
        console.log('image is uploaded')
    })

    product.save(function (err) {
        if (err) {
            return
        } else {


            res.redirect('/products/add')
        }
    })
})







module.exports = router
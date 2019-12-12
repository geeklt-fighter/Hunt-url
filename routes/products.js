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

// Bring in Article Models
let Product = require('../models/Products')
// Bring in User Models
let User = require('../models/Users')


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
    // product.advisor = req.body.advisor
    product.advisor = req.user._id  // You must login, otherwise you will get 500 error
    product.description = req.body.description

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


    product.img_url = getAuthImageUrl(blobName)

    product.save(function (err) {
        if (err) {
            return
        } else {
            res.redirect('/mainpage')
        }
    })
})


// Load edit form
router.get('/edit/:id', (req, res) => {
    Product.findById(req.params.id, function (err, product) {
        res.render('edit_product', {
            title: 'Edit Product',
            product: product
        })
    })
})

// Update submit post route
router.post('/edit/:id', (req, res) => {
    let product = {}
    console.log(req.body)
    product.name = req.body.name
    // product.advisor = req.body.advisor
    product.description = req.body.description

    let query = { _id: req.params.id }
    Product.updateOne(query, product, function (err) {
        if (err) {
            console.log(err)
            return
        } else {
            res.redirect('/mainpage')
        }
    })
})

router.delete('/:id', (req, res) => {
    if (!req.user._id) {
        res.status(500).send()
    }
    console.log('id:',req.params.id)
    let query = { _id: req.params.id }

    Product.findById(req.params.id, function (err, product) {
        Product.deleteOne(query, function (err) {
            if (err) {
                console.error(err)
            }
            res.send('Success')
        })
    })
})


// Get Single Article
router.get('/:id', (req, res) => {

    Product.findById(req.params.id, function (err, product) {

        User.findById(product.advisor, function (err, user) {
            console.log(user)
            res.render('product', {
                product: product,
                advisor: user
            })
        })
    })
})


var getAuthImageUrl = (blobName) => {
    let url = blobService.getUrl(containerName, blobName)
    let sas = blobService.generateSharedAccessSignature(containerName, blobName, {
        AccessPolicy: {
            Permissions: azureStorage.BlobUtilities.SharedAccessPermissions.READ,
            Start: azureStorage.date.minutesFromNow(-15),
            Expiry: azureStorage.date.minutesFromNow(3000)
        }
    })
    console.log('sas: ', sas)

    return `${url}?${sas}`
}

// Access Control
var ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated) {
        return next()
    } else {
        res.redirect('/users/login')
    }
}










module.exports = router
const mongoose = require('mongoose')


const ProdSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    advisor: {
        type: String,
        required: true
    },
    description: {
        type: String,
        require: false
    },
    img_url: {
        type: String,
        required: true
    }
})


const Product = mongoose.model('Product', ProdSchema)


module.exports = Product;
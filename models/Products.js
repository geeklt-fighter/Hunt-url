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
    }
})


const Product = mongoose.model('Product', ProdSchema)


module.exports = Product;
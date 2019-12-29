const mongoose = require('mongoose')

const UrlSchema = new mongoose.Schema({
    identifier: {
        type: String,
        require: true
    },
    value: {
        type: String,
        require: true
    }
})


const Url = mongoose.model('Url', UrlSchema)

module.exports = Url
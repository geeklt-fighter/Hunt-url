const mongoose = require('mongoose')



const ThemeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})



const Theme = mongoose.model('Theme', ThemeSchema)


module.exports = Theme
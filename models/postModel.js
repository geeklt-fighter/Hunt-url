const mongoose = require('mongoose')


const postSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A post must have a name'],
        trim: true,
        maxlength: [30, 'A post name must have less or equal than 30 characters']
    },
    theme: {
        type: String,
        required: [true, 'A post must have a theme']
    },
    description: {
        type: String,
        trim: true
    },
    mediaResource: {
        type: String,
        required: [true, 'You must sharing something']
    },
    poster: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ]
})



const Post = mongoose.model('Post', postSchema)


module.exports = Post
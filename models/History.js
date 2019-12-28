const mongoose = require('mongoose')


const HistorySchema = new mongoose.Schema({
    url: {
        type: String,
        require: true
    },
    content_title: {
        type: String,
        require: true
    },
    visit_count: {
        type: Number,
        require: true
    },
    last_visit_time: {
        type: String,
        require: true
    }
})


const History = mongoose.model('History', HistorySchema)

module.exports = History
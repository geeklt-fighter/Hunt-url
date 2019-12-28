const mongoose = require('mongoose')


const HistorySchema = new mongoose.Schema({
    url: {
        type: String,
        require: true
    },
    title: {
        type: String,
        required: true
    },
    visit_count: {
        type: Number,
        required: true
    },
    last_visit_time: {
        type: String,
        required: true
    }
})


const History = mongoose.model('History', HistorySchema)

module.exports = History
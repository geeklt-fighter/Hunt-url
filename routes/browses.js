var express = require('express')
var router = express.Router()
var os = require('os')
var sqlite3 = require('sqlite3')


var homedir = os.homedir()
var historyPath = homedir.concat('\\',
    'AppData\\Local\\Google\\Chrome\\User Data\\Default\\History')
var db = new sqlite3.Database(historyPath, (err) => {
    if (!err) {
        console.log('connect success')
    }
})



router.get('/', (req, res, next) => {
    let sql = `select url,title,visit_count, datetime(last_visit_time / 1000000 + (strftime('%s', '1601-01-01T08:00:00')), 'unixepoch') as time from urls`
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err
        }
        console.log(rows)
    })
    res.send('test successfully')
})


module.exports = router

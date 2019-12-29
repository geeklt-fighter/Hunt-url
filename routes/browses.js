var express = require('express')
var router = express.Router()
var os = require('os')
var sqlite3 = require('sqlite3')
var fs = require('fs')
var mkdirp = require('mkdirp')

// Using database model
var History = require('../models/History')
var Url = require('../models/Url')

// Get the user directory
var homedir = os.homedir()
var historyPath = homedir.concat('\\',
    'AppData\\Local\\Google\\Chrome\\User Data\\Default\\History')
var stagingPath = homedir.concat('\\', 'HistoryData')
var stagingFile = stagingPath.concat('\\', 'HistoryCopy')

// Create the staging folder in order to solving the sqlite3 lock problem
if (!fs.existsSync(stagingPath)) {
    console.log('Create the folder')
    mkdirp(stagingPath)
}

var source = fs.createReadStream(historyPath)
var dest = fs.createWriteStream(stagingFile)
if (fs.statSync(historyPath).size !== fs.statSync(stagingFile).size) {
    source.pipe(dest)
}
var db
source.on('end', function () {
    db = new sqlite3.Database(stagingFile, (err) => {
        if (!err) {
            console.log('connect success')
        }
    })
})


router.get('/', (req, res, next) => {



    let sql = `select url,title,visit_count, datetime(last_visit_time / 1000000 + (strftime('%s', '1601-01-01T08:00:00')), 'unixepoch') as time from urls`
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err
        }

        History.find({}, (err, datas) => {
            for (let i = datas.length; i < rows.length; i++) {
                let history_mongo = new History({
                    url: rows[i].url,
                    content_title: rows[i].title,
                    visit_count: rows[i].visit_count,
                    last_visit_time: rows[i].time
                })
                history_mongo.save((err, history) => {
                    if (err) {
                        throw err
                    }
                })
            }

            let urlArray = []
            let netUrlArray = []
            let orgUrlArray = []
            let comUrlArray = []
            let twUrlArray = []

            for (let i = datas.length; i < rows.length; i++) {
                if (rows[i].url.includes(".io")) {
                    dispatchUrl(rows[i].url, ".io", urlArray)
                }
                else if (rows[i].url.includes(".net")) {
                    dispatchUrl(rows[i].url, ".net", netUrlArray)
                } else if (rows[i].url.includes(".org")) {
                    dispatchUrl(rows[i].url, ".org", orgUrlArray)
                } else if (rows[i].url.includes(".com") && !rows[i].url.includes(".tw")) {
                    dispatchUrl(rows[i].url, ".com", comUrlArray)
                } else if (rows[i].url.includes(".tw")) {
                    dispatchUrl(rows[i].url, ".tw", twUrlArray)
                } else {
                    console.log('other url:', rows[i].url)
                }
            }

            var grouped = groupBy(urlArray, url => url.key)
            var groupNet = groupBy(netUrlArray, url => url.key)
            var groupOrg = groupBy(orgUrlArray, url => url.key)
            var groupCom = groupBy(comUrlArray, url => url.key)
            var groupTw = groupBy(twUrlArray, url => url.key)
            saveGroup(grouped)
            saveGroup(groupNet)
            saveGroup(groupOrg)
            saveGroup(groupCom)
            saveGroup(groupTw)

        })
    })

    res.send('test successfully')
})

function dispatchUrl(url, type, container) {
    u = url.split(type, 1)
    uObject = { key: u.toString(), value: url }
    container.push(uObject)
}


function saveGroup(group) {
    let mapArray = []
    group.forEach(item => {
        mapArray.push(item)
    })
    mapArray.map((item, i) => {
        item.map((single) => {
            var history_url = new Url({ identifier: single.key, value: single.value })
            history_url.save(function (err, data) {
                if (err) {
                    throw err
                }
            })
        })
    })
}

function groupBy(list, keyGetter) {
    const map = new Map()
    list.forEach((item) => {
        const key = keyGetter(item)
        const collection = map.get(key)

        if (!collection) {
            map.set(key, [item])
        } else {
            collection.push(item)
        }
    });
    return map;
}
module.exports = router

var express = require('express')
var router = express.Router()

var Theme = require('../models/Themes')
const { ensureAuthenticated } = require('../config/auth')

// load the add_theme page
router.get('/add', ensureAuthenticated, function (req, res, next) {
    res.render('add_theme', {
        title: 'Add theme'
    })
})


router.post('/add', function (req, res, next) {
    var theme = new Theme()

    console.log(req.body.theme)
    theme.name = req.body.theme

    theme.save(function (err) {
        if (err) {
            return
        } else {
            res.redirect('/mainpage')
        }
    })

})


module.exports = router
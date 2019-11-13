var express = require('express');
var router = express.Router();
const { ensureAuthenticated } = require('../config/auth')
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('welcome')
});

router.get('/mainpage', ensureAuthenticated, function (req, res, next) {
  console.log(req.user.name)
  res.render('index', { name: req.user.name })
});


module.exports = router;

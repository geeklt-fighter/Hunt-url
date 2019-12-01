var express = require('express');
var router = express.Router();
const { ensureAuthenticated } = require('../config/auth')
const Products = require('../models/Products') 
/* GET home page. */
router.get('/', function (req, res, next) {
  Products.find({},function (err,productData) {
    if (err) {
      console.log(err)
    }else{
      res.render('index', { 
        name: res.locals.user,
        products: productData
      })
    }
  })
  // res.render('welcome')
});

router.get('/mainpage', function (req, res, next) {
  Products.find({},function (err,productData) {
    if (err) {
      console.log(err)
    }else{
      res.render('index', { 
        // name: req.user.name,
        products: productData
      })
    }
  })
});


module.exports = router;

const express = require('express');
const router = express.Router();
const bycrypt = require('bcryptjs')
const passport = require('passport')
const { ensureAuthenticated } = require('../config/auth')

// User model
const User = require('../models/Users')
// Product model
const Product = require('../models/Products')

// Login
router.get('/login', (req, res) => {
  res.render('login')
})

// Login Handle
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/mainpage',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next)
})

// Register
router.get('/register', (req, res) => {
  res.render('register')
})


// Register Handle
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body

  let errors = []
  // Check require fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please fill in all fields' })
  }

  // Check passwords match
  if (password !== password2) {
    errors.push({ msg: 'Passwords do not match' })
  }

  // Check pass length
  if (password.length <= 6) {
    errors.push({ msg: 'Password would be 6 character' })
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    })
  } else {
    // Validation passed
    User.findOne({ email: email })
      .then(function (user) {
        if (user) {
          // User exists
          errors.push({ msg: 'Email is already registered' })
          res.render('register', {
            errors,
            name,
            email,
            password,
            password2
          })
        } else {
          const newUser = new User({
            name,
            email,
            password
          })

          // Hash password
          bycrypt.genSalt(10, (err, salt) => {
            bycrypt.hash(newUser.password, salt, (err, hash) => {
              if (err)
                throw err
              // Set password to hashed
              newUser.password = hash
              // Save user 
              newUser.save()
                .then(user => {
                  req.flash('success_msg', 'You are now registered and can log in')
                  res.redirect('/users/login')
                })
                .catch(err => console.log(err))
            })
          })
        }
      })
  }
})


router.get('/profile', ensureAuthenticated, (req, res) => {
  let user = res.locals.user

  let ps = []
  Product.find({}, (err, products) => {

    products.map(product => {
      if (product.advisor == user._id) {
        ps.push(product)
      }
    })

    res.render('profile', {
      products: ps,
      user: user
    })
  })



})


// Logout Handle 
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', 'You are logged out')
  res.redirect('/mainpage')
})

module.exports = router;

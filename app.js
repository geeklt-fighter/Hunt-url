const createError = require('http-errors');
const express = require('express');
const expressLayouts = require('express-ejs-layouts')
const path = require('path');
const logger = require('morgan');
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const mongoose = require('mongoose')


const AppError = require('./utils/appError')
const GlobalErrorHandler = require('./controller/errorController')
// require('dotenv').config()

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products')
const themesRouter = require('./routes/themes')
const browsesRouter = require('./routes/browses')

const viewRouter = require('./routes/viewRouter')
const userRouter = require('./routes/userRouter')
const postRouter = require('./routes/postRouter')

const app = express();


// Passport config
require('./config/passport')(passport)


if (process.env.NODE_ENV === 'production') {
  // Connect to cosmos 
  mongoose.set('useNewUrlParser', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);
  mongoose.set('useUnifiedTopology', true);
  mongoose.connect(process.env.MongoConnectionString)
    .then(() => { console.log('CosmosDB connected') })
    .catch(err => console.log(err))

} else if (process.env.NODE_ENV === 'development') {
  // Connect to mongo
  mongoose.connect(process.env.MongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log('MongoDB connected') })
    .catch(err => console.log(err))
}



// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.use(expressLayouts)
// app.set('view engine', 'ejs');
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Express session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash())


//Global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  next()
})

app.get('*', (req, res, next) => {
  res.locals.user = req.user || null
  next()
})
// app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter)
app.use('/themes', themesRouter)
app.use('/browses', browsesRouter)

app.use('/', viewRouter)
// API Router
app.use('/api/v1/users', userRouter)
app.use('/api/v1/posts', postRouter)

app.all('*', (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} on this server`)
  // err.status = 'fail'
  // err.statusCode = 404

  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404))
})

app.use(GlobalErrorHandler)

// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;

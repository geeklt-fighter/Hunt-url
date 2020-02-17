const express = require('express');
const path = require('path');
const logger = require('morgan');
const passport = require('passport')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

const AppError = require('./utils/appError')
const GlobalErrorHandler = require('./controller/errorController')
// require('dotenv').config()

const viewRouter = require('./routes/viewRouter')
const userRouter = require('./routes/userRouter')
const postRouter = require('./routes/postRouter')

const app = express();

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

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser())



app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()
  console.log('cookies: ', req.cookies)
  console.log('locals: ', res.locals)
  next()
})

app.use('/', viewRouter)
// API Router
app.use('/api/v1/users', userRouter)
app.use('/api/v1/posts', postRouter)

app.all('*', (req, res, next) => {

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

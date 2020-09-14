// var createError = require('http-errors');
var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
const morgan = require('morgan');
const ebookRouter = require('./routes/ebookRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());

//add a date to every request - probably they already have one
app.use((req, res, next) => {
  req.requestTime = new Date();
  next();
});

app.use(express.static(`${__dirname}/public`));

//ROUTES
app.use('/api/v1/ebooks', ebookRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;














// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');
//
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
//
// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });
//
// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });


// var createError = require('http-errors');
const express = require('express');
const path = require('path');
// var cookieParser = require('cookie-parser');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const ebookRouter = require('./routes/ebookRoutes');
const userRouter = require('./routes/userRoutes');
const viewRouter = require('./routes/viewRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');


const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//GLOBAL MIDDLEWARES
app.use(express.static(path.join(`${__dirname}/public`)));

app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour'
});
app.use('/api', limiter);

app.use(express.json({limit: '10kb'}));

app.use(mongoSanitize());

app.use(xss());

//Prevent parameter pollution
app.use(hpp({
  whitelist: ['duration']
}));


//add a date to every request - probably they already have one
app.use((req, res, next) => {
  req.requestTime = new Date();
  next();
});

//ROUTES
app.use('/', viewRouter);
app.use('/api/v1/ebooks', ebookRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

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


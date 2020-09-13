// var createError = require('http-errors');
var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();

app.use(express.json());

//add a date to every request
app.use((req, res, next) => {
  req.requestTime = new Date();
  next();
})

const getAllEbooks = (req, res) => {
  res
      .status(200)
      .json({message: `Request date for all ebooks is ${req.requestTime.toLocaleDateString()}, ${req.requestTime.toLocaleTimeString()}`})
};

const getEbook = (req, res) => {
  res
      .status(200)
      .json({
        status: "success",
        data: req.params.id
      })
};

const createEbook = (req, res) => {
  res.status(201);
  console.log(req.body);
  res.send(req.body)
};

const updateEbook = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: `The data in ebook ${req.params.id} was modified`
  })
};

const deleteEbook = (req, res) => {
  res.status(204).json({
    status: 'success',
  })
};

const getAllUsers = (req, res) => {
  res
      .status(200)
      .json({message: `Request date for all users is ${req.requestTime.toLocaleDateString()}, ${req.requestTime.toLocaleTimeString()}`})
};

const getUser = (req, res) => {
  res
      .status(200)
      .json({message: `Request date for all users is ${req.requestTime.toLocaleDateString()}, ${req.requestTime.toLocaleTimeString()}`})
};

const createUser = (req, res) => {
  res
      .status(200)
      .json({message: `Request date for all users is ${req.requestTime.toLocaleDateString()}, ${req.requestTime.toLocaleTimeString()}`})
};

const updateUser = (req, res) => {
  res
      .status(200)
      .json({message: `Request date for all users is ${req.requestTime.toLocaleDateString()}, ${req.requestTime.toLocaleTimeString()}`})
};

const deleteUser = (req, res) => {
  res
      .status(200)
      .json({message: `Request date for all users is ${req.requestTime.toLocaleDateString()}, ${req.requestTime.toLocaleTimeString()}`})
};

const ebookRouter = express.Router();
app.use('/api/v1/ebooks', ebookRouter);

ebookRouter.route('/')
    .get(getAllEbooks)
    .post(createEbook);

ebookRouter.route('/:id')
    .get(getEbook)
    .patch(updateEbook)
    .delete(deleteEbook);

const userRouter = express.Router();
app.use('/api/v1/users', userRouter);

userRouter.route('/')
    .get(getAllUsers)
    .post(createUser);

userRouter.route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);


const port = 3000;
app.listen(port, ()=> {
  console.log('App running on port 3000');
});


module.exports = app;














// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');
//
// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
//
// app.use('/', indexRouter);
// app.use('/users', usersRouter);
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


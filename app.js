var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const expressJWT = require('express-jwt');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var articleRouter = require('./routes/article');
var commentRouter = require('./routes/comment');
const { PRIVATE_KEY } = require('./utils/constant');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressJWT({
  secret: PRIVATE_KEY,
  algorithms: ['HS256']
}).unless({
  path: ['/api/user/register', '/api/user/login', '/api/user/upload',
    '/api/article/allList', '/api/article/detail','/api/comment/list',
  ] //除了这两个url，其他都要验证
}))

app.use('/', indexRouter);
app.use('/api/user', usersRouter);
app.use('/api/article', articleRouter);
app.use('/api/comment', commentRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send({
      code: -1,
      msg: 'token验证失败',
    });
  } else {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  }
});

module.exports = app;

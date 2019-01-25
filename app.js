var express = require('express');

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var users = require('./routes/users');
var residence = require('./routes/residence');
var worker = require('./routes/worker');
var mutualcomment_begin = require('./routes/mutualcomment_begin');
var mutualcomment_middle = require('./routes/mutualcomment_middle');
var mutualcomment_end = require('./routes/mutualcomment_end');
var expert_middle = require('./routes/expert_middle');
var expert_end = require('./routes/expert_end');
var self_evaluation = require('./routes/self_evaluation');
var serviceobject = require('./routes/serviceobject');
var dbcommon = require('./routes/dbcommon');
var indexCalc = require('./routes/indexCalc');
var app = express();

// view engine setup
var swig = require('swig');
var swig = new swig.Swig();
app.engine('html', swig.renderFile);
app.set('view engine', 'html');

//设置views文件夹的位置
app.set('views', path.join(__dirname, 'views'));

//设置端口
app.set('port', process.env.PORT || 4000)

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());




//把静态文件挂在到一个叫log的目录下
app.use('/log', express.static(path.join(__dirname, 'public')));


app.use('/', index);
app.use('/log/users', users);
app.use('/log/residence', residence);
app.use('/log/worker', worker);
app.use('/log/mutualcomment_begin',mutualcomment_begin);
app.use('/log/mutualcomment_middle',mutualcomment_middle);
app.use('/log/mutualcomment_end',mutualcomment_end);
app.use('/log/expert_middle',expert_middle);
app.use('/log/expert_end',expert_end);
app.use('/log/self_evaluation',self_evaluation);
app.use('/log/serviceobject',serviceobject);
app.use('/log/dbcommon',dbcommon);
app.use('/log/indexCalc',indexCalc);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
 });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.listen(app.get('port'));
module.exports = app;

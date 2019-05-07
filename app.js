const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
//const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
const validator = require('express-validator');
const port = process.env.PORT || 3000;

const index = require('./routes/index');

const app = express();




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// Database config and connection
const dbConfig = require('./config/dbconnection.js');
mongoose.Promise = global.Promise;

console.log("DB connection....");
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
});
//app.use(cookieParser());

/*Session käyttöönotto
  Sessio toimii siten että luotaessa sessio syntyy selaimelle automaattisesti cookie jonka
  nimi on connect.sid (sessionid). Se ylläpitää yhteyttä palvelimella olevaan sessioon
  sen sisältämän sessioid:n avulla.
  Itse sessio sisältää sessiomuuttujia, joita voidaan lukea siirryttäessä sivulta toiselle.
  Jos sessiomuuttujana on vaikka salasana, niin sivuille siirryttäessä voidaan tutkia onko
  salasana oikea ja jos on, päästetään käyttäjä sivulle.
*/
app.use(session({
    secret: 'movieapp4201337',
    cookie: {
        maxAge: 1800000
    },
    resave: true,
    saveUninitialized: true
}));

app.use(validator()); // lomakevalidaattorin käyttöönotto

// Reitit eri sivuille
app.use('/', index);
//app.use('/movie/', moviepage);
//app.use('/register', register);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error('Not Found');
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
    res.send(err);
});

app.listen(port, () => {
    console.log("Listening on port " + port)
})

module.exports = app;

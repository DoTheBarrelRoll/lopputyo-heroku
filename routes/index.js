const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const db = require('../config/dbconnection');
const userSchema = require('../models/User');
const Rating = require('../models/Rating');
const movieSchema = require('../models/Movie');
const Movie = mongoose.model('movie', movieSchema);
const User = require('../models/User');
const bcrypt = require('bcrypt');

let sess;


// Etusivu, jossa listataan kaikki elokuvat
router.get('/', (req, res) => {
    sess = req.session;
    console.log(sess);
    
    // Haetaan kaikki elokuvat tietokannasta ja listataan ne etusivulla
    Movie.find({}, (err, docs) => {
        if (err) console.log(err);
        res.render('index', {
            leffat: docs,
            username: sess.username
        });
    });
});

// Ulos kirjautuminen
router.get('/logout', (req, res) => {
    // Pyyhitään sess muuttuja, tuhotaan sessio ja ohjataan etusivulle
    sess = null;
    req.session.destroy();
    res.redirect('/');
});

// Reitti elokuvien lisäämiseen
router.get('/movie/add', (req, res) => {
    sess = req.session;

    res.render('addmovie', {
        errors: sess.errors,
        username: sess.username
    });
});

// Elokuvan postaaminen
router.post('/movie/add', (req, res) => {
    sess = req.session;
    req.checkBody('title', 'Please provide a title').notEmpty();
    req.checkBody('summary', 'Please provide a summary').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        sess.errors = errors;
        res.redirect('/movie/add');
    } else {
        var leffa = {
            name: req.body.title,
            genre: req.body.genre,
            director: req.body.director,
            releaseDate: req.body.releasedate,
            summary: req.body.summary
        };

        Movie.create(leffa, function(err, success) {
            if (err) {
                console.log(err);
            } else {
                res.redirect('/');
            }
        })
    }
});

// Elokuvien omat sivut ID:n mukaan
router.get('/movie/:id', (req, res) => {

    // Etsitään elokuva id:n perusteella ja näytetään sen tiedot ja arvostelut sen omalla sivulla
    Movie.find({ _id: req.params.id }, (err, leffa) => {
        Rating.find({ movieId: req.params.id}, (errs, arviot) => {
            if (err) console.log(err);
            console.log(arviot + leffa);
            res.render('moviepage', {
                leffat: leffa,
                arvostelut: arviot,
                username: sess.username
            });
        });
        
    });
});

// Reitti elokuvan arvostelua varten
router.get('/movie/:id/rate', (req, res) => {
    sess = req.session;
    errors = null;

    // Jos käyttäjä ei ole kirjautunut sisään, ohjataan hänet kirjautumissivulle
    if (!sess.username) {
        sess.errors = [{msg: 'You must be logged in to rate a movie!'}];
        res.redirect('/login');
    } else {
        Movie.findOne({ _id: req.params.id}, (err, doc) => {
            console.log(doc);
            res.render('ratingpage', {
                leffa: doc,
                username: sess.username,
                errors: sess.errors
            });
        });
    }
    
});

// Syötetään elokuvan arvostelu tietokantaan
router.post('/movie/:id/saverating', (req, res) => {
    //TODO: tallenna arvostelut
    sess = req.session;
    var errors = null;

    // Tarkistetaan, että annetut tiedot ovat kunnolliset
    req.checkBody('grade', 'Grade is required').notEmpty();
    req.checkBody('grade', 'Provide a number between 0 and 5').isInt({ min: 0, max: 5});

    errors = req.validationErrors();
    
    // Jos virheitä löytyy, ohjataan käyttäjä takaisin
    // ja näytetään virheet
    if (errors) {
        sess.errors = errors;
        res.redirect('/movie/' + req.params.id + '/rate');
    } else {
        var arvostelu = { grade: req.body.grade, comment: req.body.comment || null, user: sess.username, movieId: req.params.id };
        Rating.create(arvostelu, function(err, success) {
            if (err) {
                console.log(err);
            }
            console.log(success);
            res.redirect('/movie/' + req.params.id);
        });
    }
    // {,
});

// Käyttäjän rekisteröinti sivu
router.get('/register', (req, res) => {

    // Tallennetaan sessio sess muuttujaan, jotta voidaan näyttää virheet rekisteröintisivulla
    // jos tietojen syötössä on väärää/puutteellista tietoa
    sess = req.session;
    res.render('register', {
        errors: sess.errors,
        username: sess.username
    });
    req.session.errors = null;
});



// Tietojen syöttö reitti
router.post('/register', (req, res) => {
    sess = req.session;
    var errors = null;

    // Tarkistetaan, että annetut tiedot ovat kunnolliset
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Please enter a valid email').isEmail();
    req.checkBody('pass1', 'Password is required').notEmpty();
    req.checkBody('pass2', 'Please confirm password').notEmpty();
    req.checkBody('pass1', 'Passwords dont match.').equals(req.body.pass2);

    // Jos virheitä ilmenee, tallennetaan ne errors muuttujaat
    errors = req.validationErrors();
    
    // Jos virheitä löytyy, ohjataan käyttäjä takaisin
    // ja näytetään virheet
    if (errors) {
        sess.errors = errors;
        res.redirect('/register');
    } else {
        // Jos tiedot oikein, tarkistetaan, onko sähköpostille tehty jo käyttäjä
        User.find({ email: req.body.email }, (err, user) => {
            if (user.length) {
                // Jos käyttäjä on jo rekisteröity, kerrotaan siitä käyttäjälle
                errors = [{ msg: "Email already registered, enter a different email" }];
                sess.errors = errors;
                res.redirect('/register');
            } else {
                // Jos sähköpostia ei löydy, rekisteröidään uusi käyttäjä
                var hashPassu = bcrypt.hashSync(req.body.pass1, 8);
                var userinfo = {
                    username: req.body.username,
                    password: hashPassu,
                    email: req.body.email
                };

                var user = new User(userinfo);
                user.save();

                // Kun käyttäjä on rekisteröity, kirjaudutaan sisään ja palataan etusivulle
                sess.login = true;
                sess.username = req.body.username;
                res.redirect('/');
            }
        });

    }
});

// Kirjautumis sivu
router.get('/login', (req, res) => {
    sess = req.session;
    res.render('login', {
        errors: sess.errors,
        username: sess.username
    });
    
});

// Tietojen syötty sisäänkirjautumista varten
router.post('/login', (req, res) => {
    sess = req.session;
    var errors = null;

    // Tarkistetaan, että käyttäjä syöttää käyttäjänimen ja salasanan
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('pass1', 'Password is required').notEmpty();

    // Tallennetaan virheet, jos niitä löytyy
    errors = req.validationErrors();

    // Jos virheitä on, ohjataan takaisin ja näytetään virheet
    if (errors) {
        sess.errors = errors;
        res.redirect('/login');
    } else {
        // Tarkistetaan löytyykö käyttäjää tietokannasta
        User.findOne({ username: req.body.username }, (err, user) => {
            if (user.username.length) {
                // Jos käyttäjä löytyy, tarkistetaan että annettu salasana on oikein
                var auth = bcrypt.compareSync(req.body.pass1, user.password);
                if (auth == true) {
                    // Jos salasana täsmää, kirjaudutaan sisään ja etusivulle
                    sess.login = true;
                    sess.username = req.body.username;
                    sess.errors = null;
                    res.redirect('/');
                } else {
                    // Jos salasana ei täsmää, ohjataan takaisin kirjautumissivulle ja ilmoitetaan virheestä
                    errors = [{ msg: "Username or password was incorrect" }];
                    res.redirect('/login');
                }

    } else {
        // Jos käyttäjää ei löydy tietokannasta, ohjataan takaisin ja kerrotaan käyttäjälle
        errors = [{ msg: 'Username or password was incorrect' }];
        sess.errors = errors;
        res.redirect('/login');
    }
});

    }
});


module.exports = router;


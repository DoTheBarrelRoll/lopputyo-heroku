const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const db = require('../config/dbconnection');
const movieSchema = require('../models/Movie');
const Movie = mongoose.model('movie', movieSchema);

router.get('/:id', (req, res) => {
    console.log(req.params.id)
    Movie.find({_id: req.params.id}, (err, docs) => {
        if(err) console.log(err);
        res.render('moviepage', {
            leffat: docs
        });
    });
});

module.exports = router;


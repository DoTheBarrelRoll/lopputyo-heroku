const db = require('./config/dbconnection');
const mongoose = require('mongoose');
const movieSchema = require('./models/Movie');

var Movie = mongoose.model('movie', movieSchema);
var leffa = new Movie({
    name: "Fight Club",
    genre: "Drama",
    director: "David Fincher",
    releaseDate: "1999",
    summary: "An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more."
});

leffa.save((err, leffa) => {
    if (err) {
        console.log(err)
    }
    console.log("Movie added succesfully");
});


var mongoose = require('mongoose');
var ratingSchema = require('./Rating')

var movieSchema = new mongoose.Schema({
    name: { type: String, required: true },
    genre: { type: String, required: false, default: "Undefined" },
    director: { type: String, required: false, default: 'Unknown' },
    releaseDate: { type: String, required: false, default: 'Unknown' },
    summary: { type: String, required: true}
});



module.exports = movieSchema;
const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    movieID: {type: String, required: true},
    name: {type: String, required: true},
    category: {type: String, required: true},
    desc: {type: String, required: true},
    runtime: {type: String, required: true}
});

const Movie = mongoose.model("movie", movieSchema);

module.exports = Movie;
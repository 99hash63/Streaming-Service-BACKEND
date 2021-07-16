const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    categoryID: {type: String, required: true},
    name: {type: String, required: true},
    desc: {type: String, required: true},
});

const Category = mongoose.model("category", categorySchema);

module.exports = Category;
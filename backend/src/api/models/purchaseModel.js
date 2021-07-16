const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
    purchaseID: {type: String, required: true},
    movieID: {type: String, required: true},
    userID: {type: String, required: true},
    purchaseDate: {type: Date, required: true},
    price: {type: Number, required: true}
});

const Purchase = mongoose.model("purchase", purchaseSchema);

module.exports = Purchase;
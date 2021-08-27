const mongoose = require('mongoose');

//creating user schema
const userSchema = new mongoose.Schema({
	email: { type: String, required: true },
	passwordHash: { type: String, required: true },
});

//creating user model
const User = mongoose.model('user', userSchema);

module.exports = User;

const router = require('express').Router();
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');
const { check, validationResult } = require('express-validator');

//@route    POST http://localhost:5000/auth
//@desc     Save or register new user
//@access   public
router.post(
	'/',
	[
		// @validations
		check('email', 'email is empty').not().isEmpty().trim().escape(),
		check('email', 'invalid email address')
			.isEmail()
			.normalizeEmail()
			.trim()
			.escape(),
		check('password', 'password is empty or too short!')
			.not()
			.isEmpty()
			.trim()
			.escape()
			.isLength({ min: 6 }),
		check('passwordVerify', 'passwordVerify is empty!')
			.not()
			.isEmpty()
			.trim()
			.escape(),
		check('passwordVerify', 'passwords do not match')
			.trim()
			.escape()
			.custom((value, { req }) => value === req.body.password),
	],

	async (req, res) => {
		try {
			const { email, password, passwordVerify } = req.body;

			//handling request validations
			const error = validationResult(req);
			if (!error.isEmpty())
				return res.status(400).json({
					erroMessage: error,
				});

			//Checking if user email already exists
			const existingUser = await User.findOne({ email: email });
			if (existingUser)
				return res.status(400).json({
					erroMessage: 'An account with this email already exists',
				});

			//@hash the password
			const salt = await bcrypt.genSalt();
			const passwordHash = await bcrypt.hash(password, salt);

			//@create new user document and save to the DB
			const newUser = new User({
				email,
				passwordHash,
			});
			const savedUser = await newUser.save();

			//@login the user immediately after creating account
			//sign the token
			const token = jwt.sign(
				{
					userID: savedUser._id,
					userEmail: savedUser.email,
				},
				process.env.JWT_SECRET
			);

			//send the token to the browser on a HTTP-only cookie
			res
				.cookie('token', token, {
					httpOnly: true,
				})
				.send();
		} catch (err) {
			console.error(err);
			res
				.status(500)
				.send({ status: 'Error with creating user', error: err.message });
		}
	}
);

//@route    POST http://localhost:5000/auth/login
//@desc     endpoint for user login
//@access   public
router.post(
	'/login',
	[
		// @validations
		check('email', 'email is empty').not().isEmpty().trim().escape(),
		check('email', 'invalid email address')
			.isEmail()
			.normalizeEmail()
			.trim()
			.escape(),
		check('password', 'invalid password')
			.not()
			.isEmpty()
			.trim()
			.escape()
			.isLength({ min: 6 }),
	],
	async (req, res) => {
		try {
			const { email, password } = req.body;

			//handling request validations
			const error = validationResult(req);
			if (!error.isEmpty())
				return res.status(400).json({
					erroMessage: error,
				});

			//checking if email is registered
			const existingUser = await User.findOne({ email: email });
			if (!existingUser)
				return res.status(401).json({
					errorMessage: 'Wrong email or password',
				});

			//validating password match
			const passwordCorrect = await bcrypt.compare(
				password,
				existingUser.passwordHash
			);
			if (!passwordCorrect)
				return res.status(401).json({
					errorMessage: 'Wrong email or password',
				});

			//@sign the token
			const token = jwt.sign(
				{
					userID: existingUser._id,
					userEmail: existingUser.email,
				},
				process.env.JWT_SECRET
			);

			//@send the token to the browser on a HTTP-only cookie
			res
				.cookie('token', token, {
					httpOnly: true,
				})
				.send();
		} catch (err) {
			console.error(err);
			res.status(500).send({ status: 'Could not Login', error: err.message });
		}
	}
);

//@route    GET http://localhost:5000/auth/logout
//@desc     endpoint for user logout
//@access   public
router.get('/logout', (req, res) => {
	res
		.cookie('token', '', {
			httpOnly: true,
			expires: new Date(0),
		})
		.send();
});

//@route    GET http://localhost:5000/auth/get
//@desc     Get all users from the database
//@access   private
router.get('/get', auth, async (req, res) => {
	try {
		const UserRequsets = await User.find();
		res.json(UserRequsets);
	} catch (err) {
		console.log(err);
		res
			.status(500)
			.send({ status: 'Error with getting users', error: err.message });
	}
});

//@route    GET http://localhost:5000/auth/get/:id
//@desc     Get user for a perticular ID
//@access   private
router.get('/get/:id', auth, async (req, res) => {
	try {
		let id = req.params.id;

		const UserRequset = await User.findById(id);
		if (!UserRequset)
			return res.status(400).json({
				erroMessage: 'invalid user id',
			});
		res.json(UserRequset);
	} catch (err) {
		console.log(err);
		res
			.status(500)
			.send({ status: 'Error with getting user', error: err.message });
	}
});

//@route    PUT http://localhost:5000/auth/update/:id
//@desc     Update user with a perticular ID
//@access   private
router.put(
	'/update/:id',
	[
		// @validations
		check('email', 'email is empty').not().isEmpty().trim().escape(),
		check('email', 'invalid email address')
			.isEmail()
			.normalizeEmail()
			.trim()
			.escape(),
		check('password', 'password is empty or too short!')
			.not()
			.isEmpty()
			.trim()
			.escape()
			.isLength({ min: 6 }),
		check('passwordVerify', 'passwordVerify is empty!')
			.not()
			.isEmpty()
			.trim()
			.escape(),
		check('passwordVerify', 'passwords do not match')
			.trim()
			.escape()
			.custom((value, { req }) => value === req.body.password),
	],
	auth,
	async (req, res) => {
		try {
			const { email, password, passwordVerify } = req.body;

			//handling request validations
			const error = validationResult(req);
			if (!error.isEmpty())
				return res.status(400).json({
					erroMessage: error,
				});

			//Checking if user email already exists
			const existingUser = await User.findOne({ email: email });
			if (existingUser)
				return res.status(400).json({
					erroMessage: 'An account with this email already exists',
				});

			const updateUser = { email, password, passwordVerify };
			let id = req.params.id;
			const updatedUser = await User.findByIdAndUpdate(id, updateUser);
			if (!updatedUser)
				return res.status(400).json({
					erroMessage: 'invalid user id',
				});
			res.json({ status: 'User Updated' });
		} catch (err) {
			console.log(err);
			res
				.status(500)
				.send({ status: 'Error with updating user', error: err.message });
		}
	}
);

//@route    DELETE http://localhost:5000/auth/delete/:id
//@desc     Delete user with a perticular ID
//@access   private
router.delete('/delete/:id', auth, async (req, res) => {
	try {
		let Id = req.params.id;

		const deletedUser = await User.findByIdAndDelete(Id);
		if (!deletedUser)
			return res.status(400).json({
				erroMessage: 'invalid user id',
			});
		res.status(200).send({ status: 'User deleted' });
	} catch (err) {
		console.log(err.message);
		res
			.status(500)
			.send({ status: 'error with deleting user', error: err.message });
	}
});

module.exports = router;

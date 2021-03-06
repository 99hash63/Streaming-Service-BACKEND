const router = require('express').Router();
const Category = require('../models/categoryModel');
const auth = require('../middlewares/auth');
const { check, validationResult } = require('express-validator');

//@route    POST http://localhost:5000/categories/add
//@desc     Save new category to the database
//@access   private
router.post(
	'/add',
	[
		// @validations
		check('categoryID', 'categoryID is empty').not().isEmpty().trim().escape(),
		check('name', 'name is empty').not().isEmpty().trim().escape(),
		check('desc', 'desc is empty').not().isEmpty().trim().escape(),
	],
	auth,
	async (req, res) => {
		try {
			const { categoryID, name, desc } = req.body;

			//handling request validations
			const error = validationResult(req);
			if (!error.isEmpty())
				return res.status(400).json({
					erroMessage: error,
				});

			//Checking if categoryID already exists
			const existindID = await Category.findOne({ categoryID: categoryID });
			if (existindID)
				return res.status(400).json({
					erroMessage: 'Category with same ID already exists',
				});

			const newCategory = new Category({ categoryID, name, desc });
			await newCategory.save();
			res.json('Category Added');
		} catch (err) {
			console.error(err);
			res
				.status(500)
				.send({ status: 'Error with adding category', error: err.message });
		}
	}
);

//@route    GET http://localhost:5000/categories/get
//@desc     Get all categories from the database
//@access   public
router.get('/get', async (req, res) => {
	try {
		const CategoryRequsets = await Category.find();
		res.json(CategoryRequsets);
	} catch (err) {
		console.log(err);
		res
			.status(500)
			.send({ status: 'Error with getting categories', error: err.message });
	}
});

//@route    GET http://localhost:5000/categories/get/:id
//@desc     Get category for a perticular ID
//@access   public
router.get('/get/:id', async (req, res) => {
	try {
		let id = req.params.id;

		const CategoryRequset = await Category.findById(id);
		if (!CategoryRequset)
			return res.status(400).json({
				erroMessage: 'invalid id',
			});
		res.json(CategoryRequset);
	} catch (err) {
		console.log(err);
		res
			.status(500)
			.send({ status: 'Error with getting category', error: err.message });
	}
});

//@route    PUT http://localhost:5000/categories/update/:id
//@desc     Update category with a perticular ID
//@access   private
router.put(
	'/update/:id',
	[
		// @validations
		check('name', 'name is empty').not().isEmpty().trim().escape(),
		check('desc', 'desc is empty').not().isEmpty().trim().escape(),
	],
	auth,
	async (req, res) => {
		try {
			const { name, desc } = req.body;

			//handling request validations
			const error = validationResult(req);
			if (!error.isEmpty())
				return res.status(400).json({
					erroMessage: error,
				});

			const updateCategory = { name, desc };
			let id = req.params.id;
			const updatedCategory = await Category.findByIdAndUpdate(
				id,
				updateCategory
			);
			if (!updatedCategory)
				return res.status(400).json({
					erroMessage: 'invalid id',
				});
			res.json({ status: 'Category Updated' });
		} catch (err) {
			console.log(err);
			res
				.status(500)
				.send({ status: 'Error with updating category', error: err.message });
		}
	}
);

//@route    DELETE http://localhost:5000/categories/delete/:id
//@desc     Dlete category with a perticular ID
//@access   private
router.delete('/delete/:id', auth, async (req, res) => {
	try {
		let Id = req.params.id;

		const deletedCategory = await Category.findByIdAndDelete(Id);
		if (!deletedCategory)
			return res.status(400).json({
				erroMessage: 'invalid id',
			});
		res.status(200).send({ status: 'Category deleted' });
	} catch (err) {
		console.log(err.message);
		res
			.status(500)
			.send({ status: 'error with deleting category', error: err.message });
	}
});

module.exports = router;

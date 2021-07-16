const router = require("express").Router();
const Category = require("../models/categoryModel");
const auth = require("../middlewares/auth");



//@route    POST http://localhost:5000/categories/add
//@desc     Save new category to the database
//@access   private
router.post("/add", auth, async(req,res)=>{
    try{
        const {categoryID, name, desc} = req.body;

        //@validations
        // validating required fields
        if(!categoryID || !name || !desc)
            return res.status(400).json({
                erroMessage: "Please enter all required fields."
            });
        
            
        //Checking if categoryID already exists
        const existindID = await Category.findOne({categoryID: categoryID})
        if(existindID)
            return res.status(400).json({
                erroMessage: "Category with same ID already exists"
            });


        const newCategory = new Category({categoryID, name, desc})
        await newCategory.save()
        res.json("Category Added");
    }catch(err){
        console.error(err);
        res.status(500).send({status: "Error with adding category", error: err.message});
    }
});



//@route    GET http://localhost:5000/categories/get
//@desc     Get all categories from the database
//@access   public
router.get("/get", async(req,res)=>{
    try{
        const CategoryRequsets = await Category.find()
        res.json(CategoryRequsets);
    }catch(err){
        console.log(err);
        res.status(500).send({status: "Error with getting categories", error: err.message});
    }
})



//@route    GET http://localhost:5000/categories/get/:id
//@desc     Get category for a perticular ID
//@access   public
router.get('/get/:id', async(req, res) => {
    try{
        let id = req.params.id;

        const CategoryRequset = await Category.findById(id)
        res.json(CategoryRequset);
    }catch(err){
        console.log(err);
        res.status(500).send({status: "Error with getting category", error: err.message});
    }
});
   

//@route    PUT http://localhost:5000/categories/update/:id
//@desc     Update category with a perticular ID
//@access   private
router.put("/update/:id", auth, async(req, res) =>{        
   
    try{
        const {categoryID, name, desc} = req.body;

        const updateCategory = {categoryID, name, desc}
        let id = req.params.id;
        const update = await Category.findByIdAndUpdate(id , updateCategory)
        res.json({status: "Category Updated"});
    }catch(err){
        console.log(err);
        res.status(500).send({status: "Error with updating category", error: err.message});
    }
});

//@route    DELETE http://localhost:5000/categories/delete/:id
//@desc     Dlete category with a perticular ID
//@access   private
router.delete("/delete/:id", auth, async(req,res)=>{
    try{
        let Id = req.params.id;

        await Category.findByIdAndDelete(Id)
        res.status(200).send({status: "Category deleted"});
    }catch(err){
        console.log(err.message);
        res.status(500).send({status: "error with deleting category", error: err.message});
    }
});


module.exports = router;





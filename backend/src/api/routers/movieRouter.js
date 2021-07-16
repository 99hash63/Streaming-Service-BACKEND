const router = require("express").Router();
const Movie = require("../models/movieModel");
const auth = require("../middlewares/auth");
const {check, validationResult} = require('express-validator');

//@route    POST http://localhost:5000/movies/add
//@desc     Save new movie to the database
//@access   private
router.post("/add", [
        // @validations
        check('movieID', 'movieID is empty').not().isEmpty().trim().escape(),
        check('name', 'name is empty').not().isEmpty().trim().escape(),
        check('category', 'category is empty').not().isEmpty().trim().escape(),
        check('desc', 'desc is empty').not().isEmpty().trim().escape(),
        check('runtime', 'runtime is empty').not().isEmpty().trim().escape()
    ], 
    auth, async(req,res)=>{
        try{
            const {movieID, name, category, desc, runtime} = req.body;
            
            //handling request validations
            const error = validationResult(req);
            if(!error.isEmpty())
                return res.status(400).json({
                    erroMessage: error
                });

            //Checking if movieID already exists
            const existindID = await Movie.findOne({movieID: movieID})
            if(existindID)
                return res.status(400).json({
                    erroMessage: "Movie with same ID already exists"
                });


            const newMovie = new Movie({movieID, name, category, desc, runtime})
            await newMovie.save()
            res.json("Movie Added");
        }catch(err){
            console.error(err);
            res.status(500).send({status: "Error with adding Movie", error: err.message});
        }
});


//@route    GET http://localhost:5000/movies/get
//@desc     Get all movies from the database
//@access   public
router.get("/get", async(req,res)=>{
    try{
        const MovieRequsets = await Movie.find()
        res.json(MovieRequsets);
    }catch(err){
        console.log(err);
        res.status(500).send({status: "Error with getting movies", error: err.message});
    }
})



//@route    GET http://localhost:5000/movies/get/:id
//@desc     Get movie for a perticular ID
//@access   public
router.get('/get/:id', async(req, res) => {
    try{
        let id = req.params.id;

        const MovieRequset = await Movie.findById(id)
        if(!MovieRequset)
            return res.status(400).json({
                erroMessage: "invalid id"
            });
        res.json(MovieRequset);
    }catch(err){
        console.log(err);
        res.status(500).send({status: "Error with getting movie", error: err.message});
    }
});
   

//@route    PUT http://localhost:5000/movies/update/:id
//@desc     Update movie with a perticular ID
//@access   private
router.put("/update/:id", [
        // @validations
        check('name', 'name is empty').not().isEmpty().trim().escape(),
        check('category', 'category is empty').not().isEmpty().trim().escape(),
        check('desc', 'desc is empty').not().isEmpty().trim().escape(),
        check('runtime', 'runtime is empty').not().isEmpty().trim().escape()
    ],
    auth, async(req, res) =>{        
    
        try{
            const {name, category, desc, runtime} = req.body;

            //handling request validations
            const error = validationResult(req);
            if(!error.isEmpty())
                return res.status(400).json({
                    erroMessage: error
                });

            const updateMovie = {name, category, desc, runtime}
            let id = req.params.id;
            const updatedMovie = await Movie.findByIdAndUpdate(id , updateMovie)
            if(!updatedMovie)
                return res.status(400).json({
                    erroMessage: "invalid id"
                });
            res.json({status: "Movie Updated"});
        }catch(err){
            console.log(err);
            res.status(500).send({status: "Error with updating movie", error: err.message});
        }
});

//@route    DELETE http://localhost:5000/movies/delete/:id
//@desc     Dlete movie wit a perticular ID
//@access   private
router.delete("/delete/:id", auth, async(req,res)=>{
    try{
        let Id = req.params.id;

        const deletedMovie = await Movie.findByIdAndDelete(Id)
        if(!deletedMovie)
            return res.status(400).json({
                erroMessage: "invalid id"
            });
        res.status(200).send({status: "Movie deleted"});
    }catch(err){
        console.log(err.message);
        res.status(500).send({status: "error with deleting movie", error: err.message});
    }
});

module.exports = router;





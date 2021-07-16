const router = require("express").Router();
const Movie = require("../models/movieModel");
const auth = require("../middlewares/auth");



//@route    POST http://localhost:5000/movies/add
//@desc     Save new movie to the database
//@access   public
router.post("/add", auth, async(req,res)=>{
    const {movieID, name, category, desc, runtime} = req.body;

    const newMovie = new Movie({movieID, name, category, desc, runtime})
    await newMovie.save()
    .then(()=>res.json("Movie Added"))
    .catch((err)=>{
        console.log(err);
        res.status(500).send({status: "Error with adding movie", error: err.message});
    })
});


//@route    GET http://localhost:5000/movies/get
//@desc     Get all movies from the database
//@access   public
router.get("/get", auth, async(req,res)=>{
    await Movie.find()
    .then((MovieRequsets)=>{res.json(MovieRequsets);})
    .catch((err)=>{
        console.log(err);
        res.status(500).send({status: "Error with getting movies", error: err.message});
    })
})



//@route    GET http://localhost:5000/movies/get/:id
//@desc     Get movie for a perticular ID
//@access   public
router.get('/get/:id', auth, async(req, res) => {

    let id = req.params.id;

    await Movie.findById(id)
    .then(Movie => res.json(Movie))
    .catch((err)=>{
        console.log(err);
        res.status(500).send({status: "Error with getting movie", error: err.message});
    });
});
   

//@route    PUT http://localhost:5000/movies/update/:id
//@desc     Update movie wit a perticular ID
//@access   public
router.put("/update/:id", auth, async(req, res) =>{        
   
    const {movieID, name, category, desc, runtime} = req.body;

    const updateMovie = {movieID, name, category, desc, runtime}
    let id = req.params.id;
    const update = await Movie.findByIdAndUpdate(id , updateMovie)
    .then(()=>{ res.json({status: "Movie Updated"})})
    .catch((err)=>{
        console.log(err);
        res.status(500).send({status: "Error with updating movie", error: err.message});
    });
});

//@route    DELETE http://localhost:5000/movies/delete/:id
//@desc     Dlete movie wit a perticular ID
//@access   public
router.delete("/delete/:id", auth, async(req,res)=>{

    let Id = req.params.id;

    await Movie.findByIdAndDelete(Id)
    .then(()=>{res.status(200).send({status: "Movie deleted"});})
    .catch((err)=>{
        console.log(err.message);
        res.status(500).send({status: "error with deleting movie", error: err.message});
    });
});

module.exports = router;





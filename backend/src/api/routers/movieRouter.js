const router = require("express").Router();
const Movie = require("../models/movieModel");
const auth = require("../middlewares/auth");


// add new movie
router.post("/add", auth, async(req,res)=>{
    try{

        const {movieID, name, category, desc, runtime} = req.body;

        const newMovie = new Movie({movieID, name, category, desc, runtime})
        await newMovie.save()
        .then(()=>res.json("Movie Added"))
        .catch(err=> res.status(400).json('Error: '+ err));
    }catch (err){
        console.error(err);
        res.status(500).send();
    }
});


//view all movies
router.get("/get", auth, async(req,res)=>{
    await Movie.find().then((MovieRequsets)=>{
        res.json(MovieRequsets);
    }).catch((err)=>{
        console.log(err);
    })
})


 //get movie by id
router.get('/get/:id', auth, async(req, res) => {
    try{
        let id = req.params.id;

        await Movie.findById(id)
        .then(Movie => res.json(Movie))
        .catch(err => res.status(400).json('Error: ' + err));
    }catch (err){
        console.error(err);
        res.status(500).send();
    }
  });
   

//update movie
router.put("/update/:id", auth, async(req, res) =>{        
    
    const {movieID, name, category, desc, runtime} = req.body;

    const updateMovie = {movieID, name, category, desc, runtime}
    let id = req.params.id;
    const update = await Movie.findByIdAndUpdate(id , updateMovie).then(()=>{ 
        res.json({status: "Movie Updated"})
    }).catch((err)=>{
        console.log(err);
        res.json({status: "Error with updating data"});
    })
})

// delete movie
router.delete("/delete/:id", auth, async(req,res)=>{
    let Id = req.params.id;

    await Movie.findByIdAndDelete(Id).then(()=>{
        res.status(200).send({status: "Movie deleted"});
    }).catch((err)=>{
        console.log(err.message);
        res.status(500).send({status: "error with deleting movie", error: err.message});
    })
})


module.exports = router;





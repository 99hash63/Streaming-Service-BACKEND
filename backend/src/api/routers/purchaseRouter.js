const router = require("express").Router();
const Purchase = require("../models/purchaseModel");
const auth = require("../middlewares/auth");

//@route    POST http://localhost:5000/purchases/add
//@desc     Save new purchase to the database
//@access   private
router.post("/add", auth, async(req,res)=>{
    try{
        const {purchaseID, movieID, userID, purchaseDate, price} = req.body;

        const newPurchase = new Purchase({purchaseID, movieID, userID, purchaseDate, price})
        await newPurchase.save()
        res.json("Purchased The Movie");
    }catch(err){
        console.error(err);
        res.status(500).send({status: "Error with purchasing movie", error: err.message});
    }
});


//@route    GET http://localhost:5000/purchases/get
//@desc     Get all purchases from the database
//@access   private
router.get("/get", auth, async(req,res)=>{
    try{
        const PurchaseRequests = await Purchase.find()
        res.json(PurchaseRequests);
    }catch(err){
        console.log(err);
        res.status(500).send({status: "Error with getting purchases", error: err.message});
    }
})



//@route    GET http://localhost:5000/purchases/get/:id
//@desc     Get purchase for a perticular ID
//@access   private
router.get('/get/:id', auth, async(req, res) => {
    try{
        let id = req.params.id;

        const PurchaseRequest = await Purchase.findById(id)
        res.json(PurchaseRequest);
    }catch(err){
        console.log(err);
        res.status(500).send({status: "Error with getting purchase", error: err.message});
    }
});
   

//@route    PUT http://localhost:5000/purchases/update/:id
//@desc     Update purchase with a perticular ID
//@access   private
router.put("/update/:id", auth, async(req, res) =>{        
   
    try{
        const {purchaseID, movieID, userID, purchaseDate, price} = req.body;

        const updatePurchase = {purchaseID, movieID, userID, purchaseDate, price}
        let id = req.params.id;
        const update = await Purchase.findByIdAndUpdate(id , updatePurchase)
        res.json({status: "Purchase Updated"});
    }catch(err){
        console.log(err);
        res.status(500).send({status: "Error with updating Purchase", error: err.message});
    }
});

//@route    DELETE http://localhost:5000/purchases/delete/:id
//@desc     Dlete purchase wit a perticular ID
//@access   private
router.delete("/delete/:id", auth, async(req,res)=>{
    try{
        let Id = req.params.id;

        await Purchase.findByIdAndDelete(Id)
        res.status(200).send({status: "Purchase deleted"});
    }catch(err){
        console.log(err.message);
        res.status(500).send({status: "error with deleting Purchase", error: err.message});
    }
});

module.exports = router;





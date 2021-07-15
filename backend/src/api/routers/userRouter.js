const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


//endpoint for register user
router.post("/", async(req, res)=>{

    try{
        //seperate request body to constants
        const {email, password, passwordVerify} = req.body;

        //validations
        // validating required fields
        if(!email || !password || !passwordVerify)
            return res.status(400).json({
                erroMessage: "Please enter all required field."
            });
        
        //validating password length
        if(password.length < 6)
            return res.status(400).json({
                erroMessage: "Password should be atleast 6 chars long."
            });

        //Checking if password and passwordVerify match
        if(password !== passwordVerify)
            return res.status(400).json({
                erroMessage: "Passwords did not match!."
            });
        
        //Checking if user email already exists
        const existingUser = await User.findOne({email: email})
        if(existingUser)
            return res.status(400).json({
                erroMessage: "An account with this email already exists"
            });

        //hash the password
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        console.log(passwordHash)
        
        //create new user document
        const newUser = new User({
            email, passwordHash
        })
        //save new user account to the DB
        const savedUser = await newUser.save();

        //login the user immediately after creating account
        //sign the token
        const token = jwt.sign(
            {
            userID: savedUser._id,
            userEmail: savedUser.email
            }, 
            process.env.JWT_SECRET
        );
        
        //send the token to the browser on a HTTP-only cookie
        res.cookie("token", token,{
            httpOnly: true,
        }).send();

    }catch(err){
        console.error(err);
        //send response - Internal server error
        res.status(500).send();
    }
});

//endpoint for login user
router.post("/login", async(req, res)=>{
    try{
        //seperate request body to constants
        const {email, password} = req.body;

        //validations
        // validating required fields
        if(!email || !password)
            return res.status(400).json({
                erroMessage: "Please enter all required field."
            });

        //validating password match
        const existingUser = await User.findOne({email: email});
        if(!existingUser)
            return res.status(401).json({
                errorMessage: "Wrong email or password"
            });

        const passwordCorrect = await bcrypt.compare(password, existingUser.passwordHash);
        if(!passwordCorrect)
            return res.status(401).json({
                errorMessage: "Wrong email or password"
            });

        //sign the token
        const token = jwt.sign(
            {
            userID: existingUser._id,
            userEmail: existingUser.email
            }, 
            process.env.JWT_SECRET
        );
        
        //send the token to the browser on a HTTP-only cookie
        res.cookie("token", token,{
            httpOnly: true,
        }).send();

    }catch(err){
        console.error(err);
        //send response - Internal server error
        res.status(500).send();
    }
});

//endpoint for logout
router.get("/logout",(req, res)=>{
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0)
    })
    .send();
});


module.exports = router;
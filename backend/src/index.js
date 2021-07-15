const config = require('config')
const express = require('express');
const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require ('dotenv');
const app = express();
const cookieParser = require("cookie-parser");
require("dotenv").config();

const PORT = process.env.PORT || config.get('server.port')
const host = config.get('server.host')

app.use(cors({
    origin: [host],
    credentials: true,
}));
// app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("It works"); 
});

//middleware to pass json objects into req.body
app.use(express.json());
//middleware to pass cookie into req.cookies
app.use(cookieParser());
 
//connect to mongoDB
const URL= process.env.MONGODB_URL;

mongoose.connect(URL,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:false
})
const connection =mongoose.connection;
connection.once("open", ()=>{
    console.log("MongoDB connection success")
})


app.listen(PORT,()=>{
    console.log(`Server running on PORT: ${PORT}`)
})

//set up routes

app.use("/auth", require("./api/routers/userRouter"))
app.use("/customer", require("./api/routers/customerRouter"))






const config = require('config')
const express = require('express');
const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require ('dotenv');
const app = express();
const cookieParser = require("cookie-parser");
//filse system import for video stream
// const fs = require("fs");
// const multer = require("multer");
// const GridFsStorage = require("multer-gridfs-storage");
// const Grid = require("gridfs-stream");
// const methodOverride = require("method-override")

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

// app.user(methodOverride('_method'));
 
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
    //Initialize stream
    // gfs = Grid(conn.db, mongoose.mongo);
    // gfs.collection('uploads');
})

//create storage engine



app.listen(PORT,()=>{
    console.log(`Server running on PORT: ${PORT}`)
})

//set up routes

app.use("/auth", require("./api/routers/userRouter"))
app.use("/customer", require("./api/routers/customerRouter"))
app.use("/movies", require("./api/routers/movieRouter"))
app.use("/categories", require("./api/routers/categoryRouter"))

// //get video endpoint
// app.get('/video', (req, res) => {
//   const range = req.headers.range;
//   if(!range){
//       res.status(400).send("Requires Ramge header")
//   }
//   const videoPath = "../myVid.mp4";
//   const videoSize = fs.statSync("myVid.mp4").size;

//   // Parse Range
//   const CHUNK_SIZE = 10 ** 6; //1MB
//   const START = Number(range.replace(/\D/g, ""));
//   const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

//   const contentLength = end - start + 1;
//   const headers = {
//       "Content-Range": `bytes ${start}-${end}/${videoSize}`,
//       "Accept-Ranges": "bytes",
//       "Content-Length": "contentLength",
//       "Content-Type": "video/mp4",
//   };
//   res.writeHead(206, headers);

//   const videoStream = fs.createReadStream(videoPath, {start, end});

//   videoStream.pipe(res);
// });


//simple get video from DB
// app.get('/init-video', (req, res) => {
//     const db = client.db('videos');
//     const bucket = new mongoDB.GridFSBucket(db);
//     const videoPuloadStream = bucket.openDownloadStream('myVid');
//     const videReadStream =  fs.createReadStream('../myVid.mp4')
//     videoReadStream.pipe(videoPuloadStream);
//     res.status(200).send("Done....")
// });



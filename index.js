const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv")
const authRouter = require("./routes/auth")
dotenv.config();
const app = express();

app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use('/profile', express.static('upload/images'));
//Database connection
const mongo_DB_URI = "mongodb+srv://munna:Thakur@housingapi.9jmbm.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(mongo_DB_URI, {
    useUnifiedTopology : true,
    useNewUrlParser : true
})
.then(console.log("connect to mongodb..."))
.catch((error)=>{`${error} did not connect to mongodb`});


//Router
app.use("/api/auth", authRouter);



//Server conncection
const PORT = process.env.PORT;
app.listen(PORT,()=>console.log(`Server is listning on port no http://localhost/${PORT}`));



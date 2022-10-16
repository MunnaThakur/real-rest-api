const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require('multer');
const path = require("path");
const AuthModel = require("../model/UserModel");
const AdminModel = require("../model/AdminModel");
const protectRoute = require("../middleware/protectRoute");
var url = require('url');  


//destination to save images
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})
const upload = multer({storage:storage})



//Register
router.post("/register", async(req,res)=>{
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);
        const newUser = AuthModel({
            name : req.body.name.toLowerCase(),
            email : req.body.email,
            password : hashedPass
        });
        const user = await newUser.save();
        // console.log(req.body);
        res.status(200).json(user);
    }catch(error){
        res.status(500).json('Internal server error!')
    }
})


//Login
router.post("/login", async(req,res)=>{
    try {
        const user = await AuthModel.findOne({email: req.body.email});
        !user && res.status(404).json("Wrong Credentials!");    

        const validate = await bcrypt.compare(req.body.password, user.password)
        !validate && res.status(404).json("Wrong Credentials!");
        
        
            
        const token = jwt.sign({ id: user._id}, "test");
        res
        .cookie("moon", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        });
        // res.setHeader(
        //     "Set-Cookie",
        //     `moon=${token}; Secure; HttpOnly; SameSite=None; Path=127.0.0.1; Max-Age=99999999;`
        // );
   

        const {password, ...other} = user._doc;
        res.status(200).json(other);

    } catch (error) {
        res.status(500).json("Internal server error")
    }
})




router.get("/users",protectRoute, async(req,res)=>{
    try {
        const data = await AuthModel.find();
        res.status(200).json({ data });
      } catch (error) {
        res.status(500).json({ message: "Internal server error" });
        console.error(error);
      }
})

router.post("/add",protectRoute,upload.single("image"), async(req,res)=>{
    try {
        const imagename = req.file.filename;
        const host = req.hostname;
        const protocol = req.protocol;
        const filePath = `${protocol}://${host}/profile/${imagename}`;

        const newUser = AdminModel({
          title: req.body.title,
          description: req.body.description,
        //photo: `http://localhost:3000/profile/${req.file.filename}`,
          photo:filePath,
          facilities: req.body.facilities,
          price : req.body.price
        });
        const user = await newUser.save();
        return res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message : "Internal server error"});
    }
    return res.json(req.file.filename)
})

router.get("/check", (req, res)=>{
    const imagename = req.file.filename;
    const host = req.hostname;
    const protocol = req.protocol;
    const filePath = `${protocol}://${host}/profile/${imagename}`;
    return res.json(filePath)
    
})

router.get("/public-users", async(req,res)=>{
    try {
        const data = await AuthModel.find();
        res.status(200).json({ data });
      } catch (error) {
        res.status(500).json({ message: "Internal server error" });
      }
})
module.exports = router;

const express = require('express');
let router = express.Router();
const User = require("../model/User");
const { registerValidation, loginValidation } = require("../model/validation/validation")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

router.post("/register", async (req, res) => {
    //Validate
    console.log(req.body)
    const { error } = registerValidation(req.body);
    if (error) {
        return res.status(400).json({ status: "fail", error: error.details[0] })
    }
    //Check for user 
    const emailExists = await User.findOne({ email: req.body.email })
    if (emailExists) return res.status(400).json({
        status: "fail",
        error: "Email already exists"
    })

    // Hasing the password 
    const salt = await bcrypt.genSalt(10)
    const hashPass = await bcrypt.hash(req.body.password, salt);

    //Create a new user 
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPass,
    })
    //Saving into database
    try {
        const savedUser = await user.save();
        res.json({
            status: "success",
            user: savedUser._id
        })
    }
    //Catching any errors
    catch (e) {

        res.status(400).send(e)
    }


})


router.post("/login", async (req, res) => {
    //Validate
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).json({ status: "fail", error: error.details[0].message });

    //Check for user 
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).json({ status: "fail", error: "Email ''or Password ''is wrong" });

    //Password is correct 
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).json({ status: "fail", error: "''Email or'' Password is wrong" });

    //Create and asign a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET,{expiresIn:"7d"})
    res.header("auth-token", token).json({ status: "success", jwt: token,user:user });
})


router.get("/:user_id",(req,res)=>{
    let { user_id } = { ...req.params }
    User.findById(user_id, (err, response) => {
        if (err || response === null) return res.json({ status: "fail", error: err })
        return res.json({
            status: "success",
            user: response
        });
    })
})


module.exports = router;
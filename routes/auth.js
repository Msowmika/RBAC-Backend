// routes/auth.js
const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const router = express.Router();

router.get('/',(req,res) =>{
    throw new Error('This is a forced error')
    res.send('loginPage')
})

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });
    await user.save();
    res.status(201).json({ message: "User registered" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if(!email || !password){
      return res.status(400).send("Email or password is required")
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

  //decrypting hashed password and comparing it with user password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
    
  //Using JSON-web-Token for authorization of different users of different roles
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ userEmail: user.email, token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in",error: error.message });
  }
});

//logout
router.post("/logout",(req,res)=>{
    try{
        res.status(200).json({message : "User logged out sucessfully"})

    }
    catch(e) {
        res.status(500).json({message :"Error logging out", error: e.message})
    }   
    
})
module.exports = router;

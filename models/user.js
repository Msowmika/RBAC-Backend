//models/user.js
const mongoose =require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name : {type: String, required: true},
    email : {type: String, required: true, unique: true},
    password : {type: String, required: true},
    role : {type: String, enum:["admin","vendor","customer"],default: "customer"},
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    //hashing/encrypting password for data security
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });
  
module.exports = mongoose.model("User", userSchema);
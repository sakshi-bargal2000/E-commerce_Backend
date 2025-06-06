const asyncHandler = require('express-async-handler');
const Users = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

//to register

userRegister = asyncHandler(async(req,res)=>{
const {username, email,password,isAdmin} = req.body;
 if(!username || !email ||! password){
    res.status(400).json({message:`All Fieils are require`});

 }
 const usernameAvailable = await Users.findOne({ username });
 if (usernameAvailable) {
     throw new Error('UserName already availble');
 }

 const emailAvailable = await Users.findOne({ email });
 if (emailAvailable) {
     throw new Error('Email already availble');
 }
 const hashedPassword = await bcrypt.hash(password,10);

 const user = await Users.create({
    username,email,password:hashedPassword,isAdmin
 })

 if(user){
    const {password,...others}= user._doc;
    res.status(201).json(others);
 }else{
    res.status(400);
    throw new error(`data not valid`);
 }
});

loginUser = asyncHandler(async(req,res)=>{
    const {email,password}= req.body
    if(!email || !password){
        res.status(400)
            throw new error(`All field required`)

        }
        const user = await Users.findOne({email})

        if(!user){
            res.status(400).json({message:`No such User`})
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if(!isPasswordMatch){
            //console.log("isPasswordMatch not")
            //throw new Error('Invalid Password');
            res.status(400).json({message:`Invalid Password`});
        }

        const accessToken = jwt.sign({
            _id:user._id,
            isAdmin:user.isAdmin,
        },process.env.JWT__KEY,{expiresIn:'1D'});

        // let cart = await Cart.findOne({ userId: user._id });
        // if (!cart) {
        //     await Cart.create({
        //         userId: user._id,
        //         products: [],
        //     });
        // }

        res.status(200).json({
            user,accessToken
        });
    

})
module.exports = { userRegister,loginUser};

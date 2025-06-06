const asyncHandler = require('express-async-handler')
const Users = require('../models/userModel')
const bcrypt = require('bcryptjs');


getUsers = asyncHandler(async(req,res)=>{
    const users = await Users.find();

    if(!users ){
        res.status(400).json({message:`No user found`})
    }

    res.status(200).json(users)
})

getUser = asyncHandler(async(req,res)=>{
    const user = await Users.findById(req.params.id)
    if (!user){
        res.status(400)
        throw new Error('No such user Found')
    }
    res.status(200).json({_id: user.id,
        username: user.username,
        email: user.email})
})

updateUser = asyncHandler(async(req,res)=>{
    const userAvailable = await Users.findById(req.params.id)
    if (!userAvailable){
        res.status(400)
        throw new Error('No such user Found')
    }
    const { username, email, password } = req.body 
    const hashedPassword = await bcrypt.hash(password, 10);

    const userUpdated = await Users.findByIdAndUpdate(req.params.id, {
        username,
        email,
        password: hashedPassword
    }, 
    {new: true})
    res.status(200).json({_id: userUpdated.id,
        username: userUpdated.username,
        email: userUpdated.email})
})

deleteUser = asyncHandler(async(req,res)=>{
    const user = await Users.findById(req.params.id)
    if (!user){
        res.status(400)
        throw new Error('No User Available')
    }
    await Users.findByIdAndDelete(req.params.id)
    res.status(200).json({message:`succesfully Deleted User ${user.username}`
        //username: user.username,
        })
})
saveUserAddress = asyncHandler(async(req,res)=>{
    userId = req.user._id
    if (!userId){
        res.status(400)
        throw new Error('No such user Found')
    }
    const { address } = req.body
    const userAddress = await Users.findByIdAndUpdate(userId, {address: address}, {new: true}).select('username address')
    res.json(userAddress)
})
getWishlist = asyncHandler(async(req,res)=>{
    userId = req.user._id
    if (!userId){
        res.status(400)
        throw new Error('No such user Found')
    }
    const userWishlist = await Users.findById(userId).populate("wishlist").select('username wishlist')
    res.status(200).json(userWishlist)
})

module.exports = {getUsers,getUser,updateUser,deleteUser,saveUserAddress,getWishlist}

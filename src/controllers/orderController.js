const asyncHandler = require('express-async-handler')
const Users = require('../models/userModel')
// const Carts = require('../models/cartModel')
const { Cart } = require("../models/cartModel");
const Products = require('../models/productModel')
const Orders = require('../models/orderModel')
const uniqid = require('uniqid')


createOrder = asyncHandler(async(req,res)=>{
    const {address , email, contact,cartTotal} = req.body;
    const userId = req.user._id;
    const user = await Users.findById(userId);

    const userCart = await Cart.findOne({userId:user._id});

    const finalAmount = cartTotal;
    const newOrder = await new Orders({
        paymentIntent:{
            id:uniqid(),
            method:'COD',
            amount:finalAmount,
            status: 'Cashon Delivery',
            created:Date.now(),
            currency:'USD'
        },
        orderby:user._id,
        email:email,
        address:address,
        contact:contact,
        orderStatus:'Cash on Delivery'
    }).save()

    res.json({message: 'Success'})

})

getOrders = asyncHandler(async(req,res)=>{
    userId = req.user._id;
    const userOrders = await orders.find();
    res.json(userOrders)
})

getOrder = asyncHandler(async(req,res)=>{
    const userOrder = await Orders.findById(req.params.id)
    res.json(userOrder)
})

getUserOrders = asyncHandler(async(req,res)=>{
    const userId = req.user._id;

    const userOrders = await Orders.find({orderby : userId})
    .populate("products.productId").populate("orderby").exec()

    if(userOrders.length) res.json([userOrders])
    else res.json({msg:'No order found'})    
})

deleteOrder = asyncHandler(async(req,res)=>{
    const orderId = req.user._id;
    const userOrderAvailable = await Orders.findOne({"paymentIntent.id":orderId})
    await Orders.findOneAndDelete({"paymentIntent.id": orderId})
    res.json({msg:'successfully deleted', userOrderAvailable})
})

updateOrderStatus = asyncHandler(async(req,res)=>{
    const {status} = req.body
    const updateOrderStatus = await Orders.findByIdAndUpdate(req.params.id,{
        orderStatus :status,
        paymentIntent :{status :status}
        
    },{new:true})
    res.json(updateOrderStatus);
})
module.exports = { createOrder, getOrders, getOrder, getUserOrders, deleteOrder, updateOrderStatus }
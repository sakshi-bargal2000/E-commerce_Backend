const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const connect = require('./src/db');
const cors = require('cors');
const port = process.env.Port||5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use();
app.use('/auth', require('./src/routes/authRoute'))
app.use('/user', require('./src/routes/userRoute'))
app.use('/products', require('./src/routes/productRoute'))
app.use('/carts', require('./src/routes/cartRoute'))
app.use('/orders', require('./src/routes/orderRoute'))

app.listen(port,(req,res)=>{
    connect();
    console.log(`server is listening on port ${port}`)
})
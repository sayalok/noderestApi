// requiring modules
const express = require('express');
const morgan = require('morgan'); // http requset logger

// Intialize module
const app = express();
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

mongoose.connect('',{
    useNewUrlParser: true
}).then(res => console.log('connected...'))
 .catch(err => console.log(err))


// requiring custom modules
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

// middleware

app.use(morgan('dev'))
app.use('/uploads',express.static('uploads'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());

app.use((req,res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    //res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization')
    if(req.method === 'OPTIONS') {
        req.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }
    next()
})

app.use('/products', productRoutes)
app.use('/orders', orderRoutes)
app.use('/user',userRoutes)

app.use((req,res,next) => {
    const error = new Error('Not Found');
    error.status = 404
    next(error)
})

app.use((error,req,res,next) => {
    res.status(error.status || 500);
    res.json({
        error : {
            message: error.message
        }
    })
})

module.exports = app;

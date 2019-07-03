const express = require('express');
const mongoose = require('mongoose')

const router = express.Router();
const checkAuth = require('../middleware/check-auth')


const Order = require('../models/orders')
const Product = require('../models/product')

router.get('/', checkAuth, (req, res, next) => {
    Order.find()
        .exec()
        .then(result => {
            let i = 0;
            const data = {
                message: "Total Oreder List",
                count: result.length,
                orders: result.map(val => {
                    i++
                    return {
                        serial: i,
                        _id: val._id,
                        product_id: val.product,
                        quantity: val.quantity
                    }
                })
            }
            res.status(200).json(data)
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

router.post('/', checkAuth, (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {  
            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                product: req.body.productId,
                quantity: req.body.quantity,
            })
            return order.save()              
        })
        .then(result => {
            res.status(201).json(result)
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

router.get('/:orderId',  checkAuth, (req, res, next) => {
    const oId = req.params.orderId
//    console.log()
    Order.findById(oId)
        .exec()
        .then(data => {
            if(data) {
                res.status(200).json({
                    message: "Get the order",
                    product: {
                        _id: data._id,
                        product_id: data.product,
                        quantity: data.quantity,
                        request: {
                            Method: "GET",
                            url: "http://localhost:3000/orders/"+data._id
                        }
                    }
                })
            }else{
                res.status(404).json({message: "Invalid Order Id"})
            }
        })
        .catch()
})

router.delete('/:orderId', checkAuth, (req, res, next) => {
    const oId = req.params.orderId
    Order.remove({_id:oId})
            .exec()
            .then(result => {
                res.status(200).json(result)
            })
            .catch(err => {
                res.status(500).json({error:err})
            })
})



module.exports = router
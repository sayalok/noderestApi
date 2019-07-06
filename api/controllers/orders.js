const mongoose = require('mongoose')

const Order = require('../models/orders')
const Product = require('../models/product')

exports.orders_get_all = (req, res, next) => {
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
}

exports.orders_create_order = (req, res, next) => {
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
}

exports.orders_single_order_byId = (req, res, next) => {
    const oId = req.params.orderId
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
}

exports.orders_delete_order = (req, res, next) => {
    const oId = req.params.orderId
    Order.remove({_id:oId})
            .exec()
            .then(result => {
                res.status(200).json(result)
            })
            .catch(err => {
                res.status(500).json({error:err})
            })
}
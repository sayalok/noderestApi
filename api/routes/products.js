const express = require('express');
const mongoose = require('mongoose');

const Product = require('../models/product')


const router = express.Router();



router.get('/',(req, res, next) => {
    Product.find()
        .exec()
        .then(data => {
            res.status(200).json({
                message: "Product List",
                data
            })
        })
        .catch(err => {
            res.status(500).json({error:err})
        })
})

router.post("/",(req, res, next) => {
    const product = new Product({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            price: req.body.price
        })
    product
        .save()
        .then(result => {
            res.status(201).json({
                message: "Product Created Successfully",
                data: product
            })
        })
        .then(err => {
            console.log(err)
        })
})

router.get('/:productId',(req, res, next) => {
    let pid = req.params.productId
    Product.findById(pid)
        .exec()
        .then(data => {
            if(data) {
                res.status(200).json(data)
            }else{
                res.status(404).json({message: "Invalid Product Id"})
            }
        })
        .catch(err => {
            res.status(500).json({error:err})
        })
})

router.patch('/:productId',(req, res, next) => {
    let pid = req.params.productId
    const updatePro = {
        name: req.body.name,
        price: req.body.price
    }
    Product.updateOne({_id:pid}, { $set: updatePro})
        .exec()
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({error: err})
        })
})

router.delete('/:productId',(req, res, next) => {
    let pid = req.params.productId;
    Product.remove({_id:pid})
            .exec()
            .then(result => {
                res.status(200).json(result)
            })
            .catch(err => {
                res.status(500).json({error:err})
            })
})
module.exports = router
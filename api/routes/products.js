const express = require('express');
const mongoose = require('mongoose');

const Product = require('../models/product')
const multer = require('multer')
const checkAuth = require('../middleware/check-auth')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null,file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        cb(null, true)
    }else{
        cb(null,false)
    }
}

const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})


const router = express.Router();



router.get('/',(req, res, next) => {
    Product.find()
        .select("name price _id productImage") //define which field data to fetch
        .exec()
        .then(data => {
            let i = 0;
            const result = {
                message: "Product List",
                count: data.length,
                products: data.map(d => {
                    i++
                    return {
                        Serial: i,
                        name: d.name,
                        price: d.price,
                        productImage: d.productImage,
                        _id: d._id,
                        request: {
                            Method: "GET",
                            url: "http://localhost:3000/products/"+d._id
                        }
                    }
                })
            }
            res.status(200).json({ result })
        })
        .catch(err => {
            res.status(500).json({error:err})
        })
})

router.post("/", checkAuth, upload.single('productImage'), (req, res, next) => {
    const product = new Product({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            price: req.body.price,
            productImage: req.file.path
        })
    product
        .save()
        .then(result => {
            res.status(201).json({
                message: "Product Created Successfully",
                product: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    productImage: result.productImage,
                    request: {
                        Method: "GET",
                        url: "http://localhost:3000/products/"+result._id
                    }
                }
            })
        })
        .catch(err => {
            res.status(500).json({error:err})
        })
})

router.get('/:productId',(req, res, next) => {
    let pid = req.params.productId
    Product.findById(pid)
        .select("name price _id productImage")
        .exec()
        .then(data => {
            if(data) {
                res.status(200).json({
                    message: "Get Single Product",
                    product: {
                        name: data.name,
                        price: data.price,
                        _id: data._id,
                        productImage: data.productImage,
                        request: {
                            Method: "GET",
                            url: "http://localhost:3000/products/"+data._id
                        }
                    }
                })
            }else{
                res.status(404).json({message: "Invalid Product Id"})
            }
        })
        .catch(err => {
            res.status(500).json({error:err})
        })
})

router.patch('/:productId', checkAuth, (req, res, next) => {
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

router.delete('/:productId', checkAuth, (req, res, next) => {
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
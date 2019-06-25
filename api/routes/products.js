const express = require('express');
const router = express.Router();

router.get('/',(req, res, next) => {
    res.status(200).json({
        message: "Product get"
    })
})

router.post('/',(req, res, next) => {
    const product = {
        name: req.body.name,
        price: req.body.price,
    }
    res.status(201).json({
        message: "Product Created Successfully",
        data: product
    })
})

router.get('/:productId',(req, res, next) => {
    const pid = req.params.productId
    if(pid === 3) {
        res.status(200).json({
            message: "Product get",
            id: pid
        })
    }else {
        res.status(200).json({
            message: "Not Match",
            id: pid
        })
    }
})

router.patch('/:productId',(req, res, next) => {
    const pid = req.params.productId
    res.status(200).json({
        message: "Product patch",
        id: pid
    })
})

router.delete('/:productId',(req, res, next) => {
    const pid = req.params.productId
    res.status(200).json({
        message: "Product delete",
        id: pid
    })
})
module.exports = router
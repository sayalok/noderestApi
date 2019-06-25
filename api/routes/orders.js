const express = require('express');
const router = express.Router();

router.get('/',(req, res, next) => {
    res.status(200).json({
        message: "Order get"
    })
})

router.post('/',(req, res, next) => {
    const order = {
        productId: req.body.productId,
        quantity: req.body.quantity,
    }
    res.status(201).json({
        message: "order Post",
        data: order
    })
})

router.get('/:orderId',(req, res, next) => {
    const oId = req.params.oId
    res.status(201).json({
        message: "Single order get",
        id: oId
    })
})

router.delete('/:orderId',(req, res, next) => {
    const oId = req.params.oId
    res.status(201).json({
        message: "delete order get",
        id: oId
    })
})



module.exports = router
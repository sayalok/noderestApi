const express = require('express');
const multer = require('multer')

const router = express.Router();

const checkAuth = require('../middleware/check-auth')
const productController = require('../controllers/product')

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


router.get('/', productController.product_get_all)
router.post("/", checkAuth, upload.single('productImage'), productController.product_create)
router.get('/:productId',productController.product_get_byid)
router.patch('/:productId', checkAuth, productController.product_update)
router.delete('/:productId', checkAuth, productController.product_delete_byid)

module.exports = router
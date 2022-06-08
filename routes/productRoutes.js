const router = require('express').Router()

const productController = require('../controllers/productController')
const imageUpload = require('../helpers/image-upload')

//middlewares
const verifyToken = require('../helpers/verify-token')

router.post('/create', verifyToken, imageUpload.array('images'), productController.create)
router.get('/', productController.getAll)
router.get('/myProducts', verifyToken, productController.getAllUserProducts)
router.get('/myShopping', verifyToken, productController.getAllUserShopping)
router.get('/:id', productController.getProductById)
router.delete('/:id', verifyToken, productController.removeProductById)
router.patch('/:id', verifyToken, imageUpload.array('images'), productController.updateProduct)
router.patch('/reserve/:id', verifyToken, productController.reserve)
router.patch('/sold/:id', verifyToken, productController.finishSold) 

module.exports = router 
const router = require('express').Router()

const userController = require('../controllers/userController')

//middleware
const verifyToken = require('../helpers/verify-token')
const imageUpload = require('../helpers/image-upload')

router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/checkUser', userController.checkUser)
router.get('/:id', userController.getUserById)
router.patch('/edit/:id', verifyToken, imageUpload.single('image'), userController.editUser)


module.exports = router
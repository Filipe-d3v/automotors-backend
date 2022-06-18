const Product = require('../models/Product')

//helpers
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
const User = require('../models/User')
const ObjectId = require('mongoose').Types.ObjectId

module.exports = class productController {
    static async create(req, res) {
        const { name, description, price, cep, city, uf, year, kms, motor, fuel, documents} = req.body

        const images = req.files
        const available = true

        // images upload

        //validations
        if (!name) {
            res.status(422).json({ message: 'O campo nome é obrigatório!' })
            return
        }
        if (!description) {
            res.status(422).json({ message: 'O campo descrição é obrigatório!' })
            return
        }
        if (!price) {
            res.status(422).json({ message: 'O campo preço é obrigatório!' })
            return
        }
        if (!cep) {
            res.status(422).json({ message: 'O campo CEP é obrigatório!' })
            return
        }
        if (!city) {
            res.status(422).json({ message: 'O campo cidade é obrigatório!' })
            return
        }
        if (!uf) {
            res.status(422).json({ message: 'O campo UF é obrigatório!' })
            return
        }
        if (!year) {
            res.status(422).json({ message: 'o campo ano é obrigatório!' })
            return
        }
        if (!kms) {
            res.status(422).json({ message: 'o campo Kilometros é obrigatório!' })
            return
        }
        if (!motor) {
            res.status(422).json({ message: 'o campo motor é obrigatório!' })
            return
        }
        if (!fuel) {
            res.status(422).json({ message: 'o campo combustível é obrigatório!' })
            return
        }
        if (!documents) {
            res.status(422).json({ message: 'o campo documentação é obrigatório!' })
            return
        }
        if (images.length === 0) {
            res.status(422).json({ message: 'É necessário pelo menos uma imagem para o produto!' })
            return
        }
        
        const token = getToken(req)
        const user = await getUserByToken(token)
        
        const product = new Product({
            name,
            description,
            price,
            cep,
            city,
            uf,
            year,
            kms,
            motor,
            fuel,
            documents,
            available,
            images: [],
            user: {
                _id: user._id,
                name: user.name,
                image: user.image,
                phone: user.phone,
            },
        })

        images.map((image) => {
            product.images.push(image.filename)
        })

        try {
            const newProduct = await product.save()
            res.status(201).json({ message: 'Produto cadastrado!', newProduct })
        } catch (error) {
            res.status(500).json({ message: error })
        }

    }
    static async getAll(req, res) {
        const products = await Product.find().sort('-createdAt')

        res.status(200).json({ products: products, })
    }

    static async getAllUserProducts(req, res) {

        const token = getToken(req)
        const user = await getUserByToken(token)

        const products = await Product.find({ 'user._id': user._id }).sort('-createdAt')

        res.status(200).json({ products })
    }

    static async getAllUserShopping(req, res) {
        const token = getToken(req)
        const user = await getUserByToken(token)

        const products = await Product.find({ 'buyer._id': user._id }).sort('-createdAt')

        res.status(200).json({ products })
    }

    static async getProductById(req, res) {
        const id = req.params.id

        // check if id is valid
        if (!ObjectId.isValid(id)) {
            res.status(200).json({ message: 'ID inválido!' })
            return
        }

        // Check if product exists
        const product = await Product.findOne({ _id: id })

        if (!product) {
            res.status(404).json({ message: 'Produto não encontrado!' })
        }

        res.status(200).json({ product: product, })
    }

    static async removeProductById(req, res) {
        const id = req.params.id

        if (!ObjectId.isValid(id)) {
            res.status(200).json({ message: 'ID inválido!' })
            return
        }

        // Check if product exists
        const product = await Product.findOne({ _id: id })

        if (!product) {
            res.status(404).json({ message: 'Produto não encontrado!' })
            return
        }

        //res.status(200).json({ product: product, })

        // Check if the owner of product is true

        const token = getToken(req)
        const user = await getUserByToken(token)
 
        if (product.user._id.toString() !== user._id.toString()) {
            res.status(402).json({ message: 'Ocorreu um problema! Tente novamente.' })
            return
        }

        await Product.findByIdAndDelete(id)

        res.status(200).json({ message: 'Produto removido!' }) 
    }

    static async updateProduct(req, res) {
        const id = req.params.id

        const { name, description, price, cep, city, uf, year, kms, motor, fuel, documents } = req.body

        const images = req.files

        const updatedData = {}

        const product = await Product.findOne({ _id: id })

        if (!product) {
            res.status(404).json({ message: 'Produto não encontrado!' })
            return
        }

        // Check if realy is the owner od product
        const token = getToken(req)
        const user = await getUserByToken(token)
 
        if (product.user._id.toString() !== user._id.toString()) {
            res.status(402).json({ message: 'Ocorreu um problema! Tente novamente.' })
            return
        }

        // Validations
        if (!name) {
            res.status(422).json({ message: 'O campo nome é obrigatório!' })
            return
        }else{
            updatedData.name = name
        }
        if (!description) {
            res.status(422).json({ message: 'O campo descrição é obrigatório!' })
            return
        }else{
            updatedData.description = description
        }
        if (!price) {
            res.status(422).json({ message: 'O campo preço é obrigatório!' })
            return
        }else{
            updatedData.price = price
        }
        if (!cep) {
            res.status(422).json({ message: 'O campo CEP é obrigatório!' })
            return
        }else{
            updatedData.cep = cep
        }
        if (!city) {
            res.status(422).json({ message: 'O campo cidade é obrigatório!' })
            return
        }else{
            updatedData.city = city
        }
        if (!uf) {
            res.status(422).json({ message: 'O campo UF é obrigatório!' })
            return
        }else{
            updatedData.uf = uf
        }
        if (!year) {
            res.status(422).json({ message: 'O campo ano é obrigatório!' })
            return
        }else{
            updatedData.year = year
        }
        if (!kms) {
            res.status(422).json({ message: 'O campo kilometros é obrigatório!' })
            return
        }else{
            updatedData.kms = kms
        }
        if (!motor) {
            res.status(422).json({ message: 'O campo motor é obrigatório!' })
            return
        }else{
            updatedData.motor = motor
        }
        if (!fuel) {
            res.status(422).json({ message: 'O campo combustível é obrigatório!' })
            return
        }else{
            updatedData.fuel = fuel
        }
        if (!documents) {
            res.status(422).json({ message: 'O campo documentação é obrigatório!' })
            return
        }else{
            updatedData.documents = documents
        }
        if (images.length > 0){
            updatedData.images = []
            images.map((images) => {
                updatedData.images.push(images.filename)
            })
        }

        await Product.findByIdAndUpdate(id, updatedData)

        res.status(200).json({message: 'Prduto atualizado!'})
    }

    // static async reserve(req, res) {
    //     const id = req.params.id

    //     // Check if exists 
    //     const product = await Product.findOne({ _id: id })

    //     if (!product) {
    //         res.status(404).json({ message: 'Produto não encontrado!' })
    //         return
    //     }

    //     const token = getToken(req)
    //     const user = await getUserByToken(token)
 
    //     if (product.user._id.equals(user._id)) {
    //         res.status(402).json({ message: 'Você não pode reservar o seu próprio produto!' })
    //         return
    //     }

    //     // check if buyer already reserved the product
    //     if(product.buyer) {
    //         if(product.buyer._id.equals(user._id)) {
    //             res.status(422).json({message: 'Você já reservou esse produto!',})
    //             return
    //         }
    //     }

    //     // add user to product
    //     product.buyer = {
    //         _id: user._id,
    //         name: user.name,
    //         image: user.image
    //     }

    //     await Product.findByIdAndUpdate(id, product)

    //     res.status(200).json({message: `Produto reservado com sucesso! Entre em contato com 
    //     ${product.user.name} pelo telefone ${product.user.phone}`})
    // }

    // static async finishSold(req, res) {
    //     const id = req.params.id

    //     // Check if exists
    //     const product = await Product.findOne({ _id: id })

    //     if (!product) {
    //         res.status(404).json({ message: 'Produto não encontrado!' })
    //         return
    //     }

    //     // Check if realy is the owner od product
    //     const token = getToken(req)
    //     const user = await getUserByToken(token)
 
    //     if (product.user._id.toString() !== user._id.toString()) {
    //         res.status(402).json({ message: 'Ocorreu um problema! Tente novamente.' })
    //         return
    //     }

    //     product.available = false

    //     await product.findByIdAndUpdate(id, product)

    //     res.status(201).json({message: 'Produto vendido!'})
    // }
}
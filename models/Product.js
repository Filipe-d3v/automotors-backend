const mongoose = require('../db/conn')
const { Schema } = mongoose

const Product = mongoose.model(
    'Product',
    new Schema({
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        
        price: {
            type: String,
            required: true
        },
        cep: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        uf: {
            type: String,
            required: true
        },
        year: {
            type: String,
            required: true
        },
        kms: {
            type: String,
            required: true
        },
        motor: {
            type: String,
            required: true
        },
        fuel: {
            type: String,
            required: true
        },
        documents: {
            type: String,
            required: true
        },
        images: {
            type: Array,
            required: true
        },
        available: {
            type: Boolean
        },
        user: Object,
        buyer: Object
    },
    { timestamps: true},
    )
)

module.exports = Product
const express = require('express')
const cors = require('cors')

const app = express()

//config JSON response

app.use(express.json())

//Resolver cors
app.use(cors({}))

//Ponte para imgs
app.use(express.static('public'))

//rotas
const userRoutes = require('./routes/userRoutes')
const productRoutes = require('./routes/productRoutes')

app.use('/users', userRoutes)
app.use('/products', productRoutes)


app.listen(5000)
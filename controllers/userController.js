const User = require('../models/User')

const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')

// helpers
const createUserToken = require('../helpers/create-users-tokens')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')

module.exports = class userController {
    static async register(req, res) {

        const { name, email, phone, passwd, confirmpasswd } = req.body

        //validations
        if (!name) {
            res.status(422).json({ message: 'O campo nome é obrigatório!' })
            return
        }
        if (!email) {
            res.status(422).json({ message: 'O campo email é obrigatório!' })
            return
        }
        if (!phone) {
            res.status(422).json({ message: 'O campo telefone é obrigatório!' })
            return
        }
        if (!passwd) {
            res.status(422).json({ message: 'O campo senha é obrigatório!' })
            return
        }
        if (!confirmpasswd) {
            res.status(422).json({ message: 'É necessário a confirmação da senha!' })
            return
        }
        if (passwd !== confirmpasswd) {
            res.status(422).json({ message: 'As senhas não são iguais!' })
            return
        }
        //check user exists
        const userExists = await User.findOne({ email: email })

        if (userExists) {
            res.status(422).json({ message: 'E-mail já cadastrado!' })
            return
        }
        //Create a passwd
        const salt = await bcrypt.genSalt(12)
        const passwdHash = await bcrypt.hash(passwd, salt)

        //create User
        const user = new User({
            name: name,
            email: email,
            phone: phone,
            passwd: passwdHash
        })

        try {
            const newUser = await user.save()
            await createUserToken(newUser, req, res)
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }
    static async login(req, res) {
        const { email, passwd } = req.body

        if (!email) {
            res.status(422).json({ message: 'O email é obrigatório!' })
            return
        }
        if (!passwd) {
            res.status(422).json({ message: 'A senha é obrigatória!' })
            return
        }
        //checar se usuário existe
        const user = await User.findOne({ email: email })

        if (!user) {
            res.status(422).json({ message: 'Não existe um usuário com este e-mail!' })
            return
        }
        //checar se a senha é a mesma do banco
        const checkPassword = await bcrypt.compare(passwd, user.passwd)

        if (!checkPassword) {
            res.status(422).json({ message: 'Senha inválida!' })
            return
        }

        await createUserToken(user, req, res)
    }

    static async checkUser(req, res) {
        let currentUser
        //console.log(req.headers.authorization)

        if (req.headers.authorization) {
            const token = getToken(req)
            const decoded = jwt.verify(token, 'secret')

            currentUser = await User.findById(decoded.id)
            currentUser.passwd = undefined
        } else {
            currentUser = null
        }
        res.status(200).send(currentUser)
    }

    static async getUserById(req, res) {
        const id = req.params.id

        const user = await User.findById(id).select('-passwd')

        if (!user) {
            res.status(422).json({ message: 'Usuário não encontrado!' })
            return
        }

        res.status(200).json({ user })
    }

    static async editUser(req, res) {
        const id = req.params.id

        //checar existencia de usuario
        const token = getToken(req)
        const user = await getUserByToken(token)

        const { name, email, phone, passwd, confirmpasswd } = req.body

        if(req.file){
            user.image = req.file.filename
        }
        //validations
        if (!name) {
            res.status(422).json({ message: 'O campo nome é obrigatório!' })
            return
        }
        user.name = name
        if (!email) {
            res.status(422).json({ message: 'O campo email é obrigatório!' })
            return
        }

        const userExists = await User.findOne({ email: email })

        if (user.email !== email && userExists) {
            res.status(422).json({ message: 'Email já cadastrado!' })
            return
        }

        user.email = email

        if (!phone) {
            res.status(422).json({ message: 'O campo telefone é obrigatório!' })
            return
        }

        user.phone = phone

        if (passwd !== confirmpasswd) {
            res.status(422).json({ message: 'As senhas não são iguais!' })
            return
        } else if (passwd === confirmpasswd && passwd != null) {
            const salt = await bcrypt.genSalt(12)
            const passwdHash = await bcrypt.hash(passwd, salt)

            user.passwd = passwdHash
        }

        try {
            await User.findOneAndUpdate(
                { _id: user._id },
                { $set: user },
                { new: true }
            )

            res.status(200).json({message: 'Usuário atualizado!'})
        } catch (err) {
            res.status(500).json({ message: err })
            return
        }


        // if (!passwd) {
        //     res.status(422).json({ message: 'O campo senha é obrigatório!' })
        //     return
        // }
        // if (!confirmpasswd) {
        //     res.status(422).json({ message: 'É necessário a confirmação da senha!' })
        //     return
        // }


    }
} 
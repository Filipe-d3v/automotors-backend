const jwt = require('jsonwebtoken')

const createUserToken = async(user, req, res) => {
    
    //criando token
    const token = jwt.sign({
        name: user.name,
        id: user._id
    }, "secret")

    //retornando token
    res.status(200).json({message: "Você está logado!", token: token, userId: user._id})
}



module.exports = createUserToken
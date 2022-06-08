const mongoose = require('mongoose')

async function main() {
    await mongoose.connect('mongodb+srv://Filipe:4kCJBCWPyfb9h88@nodecluster.w1df6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
    console.log('Conectado ao mongoose!')
}
main().catch(err => console.log(err))

module.exports = mongoose





//senha mongo 4kCJBCWPyfb9h88
//endereço mong mongodb+srv://Filipe:<password>@nodecluster.w1df6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
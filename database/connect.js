const mongoose = require('mongoose')

module.exports = async (fastify, opts) => {
    mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true })

    mongoose.connection.on('connected', function () {    
        console.log('Mongoose connection successfully')
    })

    mongoose.connection.on('error',function (err) {    
        console.log('Mongoose connection error: ' + err)
    })

    mongoose.connection.on('disconnected', function () {    
        console.log('Mongoose connection disconnected')
    })
}
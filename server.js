require('dotenv').config()

const mongoose = require('mongoose')

const app = require('./app')

const port = 3000

mongoose
    .connect('mongodb://127.0.0.1:27017/auth-backend')
    .then(()=>{
        app.listen(port, ()=>{
            console.log(`server started on port ${port}`)
            console.log('MongoDB connected')
        })
    }).catch((error)=>{
        console.log(error.message)
    })
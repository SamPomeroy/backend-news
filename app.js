const express = require('express')
const logger = require('morgan')
const cors = require('cors')

const app = express()

const userRouter = require('./routes/user/userRouter')
const mailjetRouter = require('./routes/Mailjet/Mailjet')

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use('/users', userRouter)
app.use('/mailjet', mailjetRouter)

module.exports = app
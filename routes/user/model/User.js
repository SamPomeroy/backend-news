const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    username: {
        type: String,
        unique: true

    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }],
})

module.exports = mongoose.model('User', userSchema)
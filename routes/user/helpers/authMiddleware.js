const {
    isEmail,
    isAlpha,
    isAlphanumeric,
    isStrongPassword,
} = require('../../utils/authMethods')

function authMiddlewareFunc(req, res, next){
    const {errorObj} = res.locals
    
    if(!isEmail(req.body.email)){
        errorObj.wrongEmailFormat = "Must be a valid email"
    }
    if(!isStrongPassword(req.body.password)){
        errorObj.validPassword = "password must contain 8 chars, 1 upper, 1 lower & 1 special char"
    }
    if(!isAlpha(req.body.firstName) || !isAlpha(req.body.lastName)){
        errorObj.validName = "name must contain only letters"
    }
    if(!isAlphanumeric(req.body.username)){
        errorObj.validUsername = 'Username must contain only alphanumeric chars'
    }
    next()
}
module.exports = {authMiddlewareFunc}
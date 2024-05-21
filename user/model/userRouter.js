const express = require('express')
const router = express.Router()
const{checkIsUndefinedFunc} = require('./helpers/checkIsUndefined')
const{checkIsEmptyFunc} = require('./helpers/checkIsEmpty')
const{authMiddlewareFunc} = require('./helpers/authMiddleware')

const {signUp, signin, getUserByID, updateUser} = require('./controller/userController')

const {checkJwtToken} = require('../utils/jwtMiddleware')

router.get('/', (req, res)=>{
    res.json({message: 'connected to app'})
})

//undefined check
//empty
router.post('/sign-up',
 checkIsUndefinedFunc,
 checkIsEmptyFunc,
 authMiddlewareFunc,
 signUp)

 router.post('/sign-in',
 checkIsUndefinedFunc,
 checkIsEmptyFunc,
 signin)

 router.get('/get-user-by-id/:id', checkJwtToken, getUserByID)

 router.put('/update-user', checkJwtToken, updateUser)

module.exports = router
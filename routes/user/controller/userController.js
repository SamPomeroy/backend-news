const User = require('../model/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const {
    isEmpty,
} = require('../../utils/authMethods')

async function signUp(req, res, next){
    console.log('hello')
    const { username, email, firstName, lastName, password} = req.body
    const {errorObj} = res.locals

            if(!isEmpty(Object.keys(errorObj))){
                return res.status(500).json({message: 'error', errorObj})
            }
            try {
                const hash = await bcrypt.hash(password, 10)
                const createdUser = new User({
                    username,
                    firstName,
                    lastName,
                    email,
                    password: hash
                })
                await createdUser.save()
                    res.json({message: 'success', data: createdUser})
                
            } catch (error) {
                res.status(500).json({message: 'failed', error: error.message})
            }
        }

async function signin(req, res, next){
    const {email, password} = req.body
    const {errorObj} = res.locals

    if(Object.keys(errorObj).length >0){
        return res.status(500).json({message: 'failure', payload: errorObj})
    }
    try {
        const foundUser = await User.findOne({email: email})
        if(!foundUser){
            return res.status(400).json({message: 'failed. please check username or password'})
        }else{
            const comparedPassword = await bcrypt.compare(password, foundUser.password)
            if(!comparedPassword){
                return res.json({message: 'failure', payload: 'please check username or password'})
            }else{
                const jwtToken = jwt.sign(
                    {
                        email: foundUser.email,
                        username: foundUser.username,
                        id: foundUser._id
                    },
                    process.env.PRIVATE_JWT_KEY,
                    {
                        expiresIn: '1d'
                    }
                )
                res.json({message: 'Logged in', payload: jwtToken})
            }
        }
    } catch (error) {
        res.json({message: 'error', error: error.message})
    }
}

async function getUserByID(req, res){
    const {id} = req.params
    try {
      const foundUser = await User.find({_id:id})
      res.json({message: "Successfully found User", foundUser})
     } catch (error) {
          res.json({message: "Error, unable to find User", error: error.message})
     }
  }
//   "username": "",
//   "lastName": "",
//   "firstName": "",
//   "email": "",
//   "password": ""
//

async function updateUser(req, res){
    try {
        const {id} = res.locals.decodedJwt
        const incomingData = req.body
        const updatedUser = await User.findByIdAndUpdate(id, incomingData, {new: true})
        res.json({message: 'user updated', payload: updatedUser})
        
    } catch (error) {
        res.status(500).json({messasge: 'failure', error: error.message})
    }
}

module.exports = {
    signUp,
    signin,
    getUserByID,
    updateUser
}
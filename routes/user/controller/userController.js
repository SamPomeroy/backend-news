const User = require('../model/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Book = require('../model/Book')

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
                res.json({message: 'Logged in', payload: jwtToken, userId: foundUser._id})
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

async function addFavorite(req,res){
    const userId = req.params.userId
    const { author, title, description, url, urlToImage, publishedAt, content} = req.body
    try {
        const user = await User.findById({_id: userId});
        if(!user){
            return res.status(500).json({message: 'user not found'})
        }
        let Book = await Book.findOne({url});
        if(!Book){
            Book = new Book({
                author,
                title,
                description,
                url,
                urlToImage,
                publishedAt,
                content
            })
            await Book.save()
        }
        if (user.favorites.includes(Book._id)){
            return res.status(500).json({message: 'Book already saved to favorites'})
        }
        user.favorites.push(Book._id);
        await user.save();
        res.status(200).json({message: 'Book added to favorites', Book})
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}
async function addToSaved(req,res){
    const userId = req.params.userId
    const { author, title, description, url, urlToImage, publishedAt, content} = req.body
    try {
        const user = await User.findById({_id: userId});
        if(!user){
            return res.status(500).json({message: 'user not found'})
        }
        let Book = await Book.findOne({url});
        if(!Book){
            Book = new Book({
                author,
                title,
                description,
                url,
                urlToImage,
                publishedAt,
                content
            })
            await Book.save()
        }
        if (user.saved.includes(Book._id)){
            return res.status(500).json({message: 'Book already saved to favorites'})
        }
        user.saved.push(Book._id);
        await user.save();
        res.status(200).json({message: 'Book saved', Book})
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}
async function deleteFavoriteById(req, res){
    try {
        
        const user= await User.findById({_id: req.params.user})
        if(!user){
            res.status(400).json({message: 'user not found'})
        }
        let Book= await Book.findOne({_id: req.params.BookId})
        if(!Book){
            res.status(400).json({message: 'Book not found'})
        }
        let foundBook= user.favorites.includes(req.params.BookId)
        if(!foundBook){
            res.status(400).json({message: 'Book not found'})
        }
        const results= await User.updateOne({_id: req.params.user}, {$pull: {favorites: req.params.BookId}}).populate({path: 'favorites', model: 'Book'})
        res.json({message: 'successfully removed from favorites', favorites: results.favorites})
    } catch (error) {
        res.status(500).json({message: 'error', error: error})
    }
}
async function deleteSavedById(req, res){
    try {
        
        const user= await User.findById({_id: req.params.user})
        if(!user){
            res.status(400).json({message: 'user not found'})
        }
        let Book= await Book.findOne({_id: req.params.BookId})
        if(!Book){
            res.status(400).json({message: 'Book not found'})
        }
        let foundBook= user.saved.includes(req.params.BookId)
        if(!foundBook){
            res.status(400).json({message: 'Book not found'})
        }
        const results= await User.updateOne({_id: req.params.user}, {$pull: {saved: req.params.BookId}})
        res.json({message: 'successfully removed from saved'})
    } catch (error) {
        res.status(500).json({message: 'error', error: error})
    }
}
async function getUserInfo(req, res){
    try {
        const user= await User.findById({_id: req.params.user})
        .populate({
            path: 'favorites',
            model: "Book"
        })
        .populate({
            path: 'saved',
            model: 'Book'
        })
        if(!user){
            res.status(400).json({message: 'user not found'})
        }
        res.json(user)
    } catch (error) {
        res.status(500).json({message: 'error', error: error})
    }
}


module.exports = {
    signUp,
    signin,
    getUserByID,
    updateUser,
    addFavorite,
    addToSaved,
    deleteFavoriteById,
    deleteSavedById,
    getUserInfo


}
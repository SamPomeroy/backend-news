const User = require('../model/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Article = require('../model/Article')

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
        let article = await Article.findOne({url});
        if(!article){
            article = new Article({
                author,
                title,
                description,
                url,
                urlToImage,
                publishedAt,
                content
            })
            await article.save()
        }
        if (user.favorites.includes(article._id)){
            return res.status(500).json({message: 'article already saved to favorites'})
        }
        user.favorites.push(article._id);
        await user.save();
        res.status(200).json({message: 'article added to favorites', article})
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
        let article = await Article.findOne({url});
        if(!article){
            article = new Article({
                author,
                title,
                description,
                url,
                urlToImage,
                publishedAt,
                content
            })
            await article.save()
        }
        if (user.saved.includes(article._id)){
            return res.status(500).json({message: 'article already saved to favorites'})
        }
        user.saved.push(article._id);
        await user.save();
        res.status(200).json({message: 'article saved', article})
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
        let article= await Article.findOne({_id: req.params.articleId})
        if(!article){
            res.status(400).json({message: 'article not found'})
        }
        let foundArticle= user.favorites.includes(req.params.articleId)
        if(!foundArticle){
            res.status(400).json({message: 'article not found'})
        }
        const results= await User.updateOne({_id: req.params.user}, {$pull: {favorites: req.params.articleId}})
        res.json({message: 'successfully removed from favorites'})
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
        let article= await Article.findOne({_id: req.params.articleId})
        if(!article){
            res.status(400).json({message: 'article not found'})
        }
        let foundArticle= user.saved.includes(req.params.articleId)
        if(!foundArticle){
            res.status(400).json({message: 'article not found'})
        }
        const results= await User.updateOne({_id: req.params.user}, {$pull: {saved: req.params.articleId}})
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
            model: "Article"
        })
        .populate({
            path: 'saved',
            model: 'Article'
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
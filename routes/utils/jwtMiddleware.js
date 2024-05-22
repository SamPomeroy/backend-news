const jwt = require('jsonwebtoken')
async function checkJwtToken(req, res, next){
    try {
        if(req.headers && req.headers.authorization){
            const jwtToken = req.headers.authorization.slice(7)
            const decodedJwt = jwt.verify(jwtToken, process.env.PRIVATE_JWT_KEY)
            res.locals.decodedJwt = decodedJwt
            next()
        }else{
            res.json({message: "no headers"})
        }
    } catch (error) {
        res.json({message: "failure", error: error.message})
    }
}

module.exports = {checkJwtToken}
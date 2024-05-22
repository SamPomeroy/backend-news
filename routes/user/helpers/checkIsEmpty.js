const {isEmpty} = require('../../utils/authMethods');

function checkIsEmptyFunc(req, res, next){
    const errorObj = {}
    const incomingData = req.body

    for(let key in incomingData){
        if(isEmpty(incomingData[key])){
            errorObj[key] = `${key} cannot be empty`
        }
    }

    if(Object.keys(errorObj).length > 0){
        return res.status(500).json({message: 'failure', payload: errorObj})
    }else{
        next()
    }
}

module.exports = {checkIsEmptyFunc}
const express = require('express')
const router = express.Router()
const {checkJwtToken} = require('../utils/jwtMiddleware')
const mailjet = require('node-mailjet').apiConnect(
    process.env.MAILJET_API_KEY,
    process.env.MAILJET_PRIVATE_KEY
)

router.post('/send-message', checkJwtToken, async(req,res)=>{
    try {
        const request = mailjet
                .post('send', { version: 'v3.1' })
                .request({
                  Messages: [
                    {
                      From: {
                        Email: "samanthapomeroy38@gmail.com",
                        Name: "Samantha Pomeroy"
                      },
                      To: [
                        {
                          Email: req.body.recipient,
                          Name: "You"
                        }
                      ],
                      Subject: "Check out this story!",
                      TextPart: req.body.message,
                    }
                  ]
                })
                const result = await request
                res.json(result.body)

    } catch (error) {
        console.log(error)
    }
})





module.exports = router
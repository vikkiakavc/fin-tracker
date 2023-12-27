const express = require('express')
const router = express.Router()
const db = require('../db/index')
const Users = db.users
const auth = require('../middleware/auth')
// const {sendWelcomeMail} = require('../email/emails')


router.post('/users/register', async (req, res) => {
    try{
        const user = await Users.create(req.body)
        const token = await user.generateAuthToken()
        console.log('data saved')
        // sendWelcomeMail(user.email, user.username)
        res.status(201).send({ user, token });
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try{
        const user = await Users.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken();
        res.status(200).send({ user, token})
    }catch(e){
        console.log(e)
        res.status(400).send(e)
    }
})

router.post('/users/logout', auth, async(req,res) => {
    try{
        const user = req.user; // Retrieve the user from the auth middleware

        // Filter out the token to be removed
        const updatedTokens = user.getDataValue('tokens').filter((token) => {
            return token.token !== req.token;
        });

        // Update the user's tokens
        await Users.update({ tokens: updatedTokens }, { where: { id: user.id } });

        res.send();
    }catch(e){
        res.status(500).send();
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        console.log('I am here')
        const user = req.user; // Retrieve the user from the auth middleware
        const updatedTokens = [];
        await Users.update({ tokens: updatedTokens }, { where: { id: user.id } });
        res.send();
    } catch (e) {
        res.status(500).send();
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})









module.exports = router
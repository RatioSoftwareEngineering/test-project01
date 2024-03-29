const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');



function verifyToken(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1];
    if (token === 'null') {
        return res.status(401).send('Unauthorized request')
    }
    let payload = jwt.verify(token, 'secretKey');
    if (!payload) {
        return res.status(401).send('Unauthorized request')
    }
    req.userId = payload.subject
}




router.post('/register', (req, res) => {
    let userData = req.body;
    let user = new User(userData);
    user.save((error, registeredUser) => {
        if (error) {
            console.log(error)
        } else {
            let payload = {subject: registeredUser.id};
            let token = jwt.sign(payload, 'secretKey');
            res.status(200).send({token})
        }
    })
});

router.post('/login', (req, res) => {
    let userData = req.body;
    User.findOne({email: userData.email}, (error, user) => {
        if (error) {
            console.log(error)
        } else {
            if (!user) {
                res.status(401).send('Invalid email')
            }
            else if (user.password !== userData.password) {
                res.status(401).send('Invalid password')
            } else {
                let payload = {subject: user.id};
                let token = jwt.sign(payload, 'secretKey');
                res.status(200).send({token})
            }
        }
    })
});


module.exports = router;

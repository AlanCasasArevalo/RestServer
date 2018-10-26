
const express = require('express');
const app = express();
const User = require('../models/user')
const bcrypt = require('bcrypt');


app.get('/user', function(req, res) {
    res.json('GET user')
});

app.post('/user', function(req, res) {

    const body = req.body;
    let salt = 10;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, salt),
        role: body.role
    });

    user.save((error, userDataBase) => {
        if (error){
            return res.status(400).json({
                result: false,
                error
            })
        }
        
        res.json({
            result: true,
            userDataBase
        })

    });

});

app.put('/user/:id', function(req, res) {
    let id = req.params.id;

    res.json({
        id
    })
});

app.delete('/user', function(req, res) {
    res.json('DELETE user')
});

module.exports = app;
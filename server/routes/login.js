const express = require('express');
const app = express();
const User = require('../models/user');
const bcrypt = require('bcrypt');

app.post('/login', (req, res) => {

    let body = req.body;

    User.findOne({ email: body.email }, (error, dbUser) => {
        if (error) {
            return res.status(500).json({
                result: false,
                error
            })
        }

        if (!dbUser) {
            return res.status(400).json({
                result: false,
                error: {
                    // TODO: hay que poner esto bien en PRO para que nadie pueda averiguar cuando esta mal cada cosa.
                    message: '(Usuario) o contraseña incorrectos'
                }
            })
        }

        if (!bcrypt.compareSync(body.password, dbUser.password)) {
            return res.status(400).json({
                result: false,
                error: {
                    // TODO: hay que poner esto bien en PRO para que nadie pueda averiguar cuando esta mal cada cosa.
                    message: 'Usuario o (contraseña) incorrectos'
                }
            })
        }

        res.json({
            result: true,
            user: dbUser,
            token: '123'
        })

    })


});

module.exports = app;
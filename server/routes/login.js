const express = require('express');
const app = express();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

        let token = jwt.sign({
            user: dbUser,
        }, process.env.SEED, { expiresIn: process.env.TOKEN_END_VALIDATION});


        res.json({
            result: true,
            user: dbUser,
            token
        })

    })

});


// GOOGLE
async function verify( token ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();

    return {
        email: payload.email,
        name: payload.name,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async (req, res) => {

    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch( error => {
           return res.status(403).json({
               result: false,
               error
           })
        });

    User.findOne({ email: googleUser.email }, (error, dbUser) => {
        if (error){
            return res.status(500).json({
                result: false,
                error
            })
        }

        if (dbUser) {
            if (dbUser.google === false){
                return res.status(400).json({
                    result: false,
                    error: {
                        message: 'Debe usar su autenticacion normal por favor'
                    }
                })

            }else {

                let token = jwt.sign({
                    user: dbUser,
                }, process.env.SEED, { expiresIn: process.env.TOKEN_END_VALIDATION});

                return res.status(200).json({
                    result: true,
                    dbUser,
                    token
                })
            }

        }else {

            let user = new User();
            user.name = googleUser.name;
            user.email = googleUser.email;
            user.img = googleUser.img;
            user.google = googleUser.google;
            user.password = ':)';

            user.save( (error, dbUser) => {
               if (error){
                   return res.status(500).json({
                       result: false,
                       error
                   })
               }

                let token = jwt.sign({
                    user: dbUser,
                }, process.env.SEED, { expiresIn: process.env.TOKEN_END_VALIDATION});

                return res.status(200).json({
                    result: true,
                    dbUser,
                    token
                })

            });

        }

    })
    
});


module.exports = app;
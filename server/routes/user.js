
const express = require('express');
const app = express();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const _ = require('underscore');

app.get('/user', function(req, res) {

    // permite ir haciendo paginacion
    let fromSkip = req.query.from || 0;

    fromSkip = Number(fromSkip);

    let limit = req.query.limit || 5;

    limit = Number(limit);


    User.find({})
        // hace que me vaya devolviendo usuarios de 5 en 5
        .skip(fromSkip)
        // Cambia el limite de usuarios devueltos
        .limit(limit)
        .exec( (error, users) => {
            if (error){
                return res.status(400).json({
                    result: false,
                    error
                })
            }

            res.json({
                result: true,
                users
            })
        })

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

    //_.pick Permite decirle a put que parametros pueden ser modificados.
    let body = _.pick( req.body, ['name', 'email', 'img', 'role', 'status'] );

    User.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true
    }, (error, userDataBase) => {

        if (error){
            return res.status(400).json({
                result: false,
                error
            })
        }

        res.json({
            result: true,
            user: userDataBase
        })
    });

});

app.delete('/user', function(req, res) {
    res.json('DELETE user')
});

module.exports = app;
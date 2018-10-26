require('./config/config')
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.get('/user', function(req, res) {
    res.json('GET user')
});

app.post('/user', function(req, res) {

    const body = req.body;
    
    if (body.name === undefined){
        res.status(400).json({
            result: false,
            message : 'name is necessary'
        })
    } else {
        res.json({
            body
        })
    }

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

mongoose.connect('mongodb://localhost:27017/cafe', (error, response) => {
    if (error) throw error

    console.log('Base de datos OK')

});

app.listen(process.env.PORT, function () {
    console.log('Escuchando en el puerto:', process.env.PORT)
});


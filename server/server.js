require('./config/config')
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path')

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use( express.static( path.resolve( __dirname + '../../public' )));
console.log( path.resolve( __dirname + '../../public' ));

app.use(require('./routes/index'));


mongoose.connect(process.env.URLDDBB, (error, response) => {
    if (error) throw error;

    console.log('Base de datos OK');
});

app.listen(process.env.PORT, function() {
    console.log('Escuchando en el puerto:', process.env.PORT);
});
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const User = require('../models/user');


app.use(fileUpload());

app.put('/uploads/:type/:id', function(req, res) {

    let type = req.params.type;
    let id = req.params.id;

    let validType = ['products', 'users'];

    if (validType.indexOf(type) < 0){
        return res.status(400).json({
            result: false,
            error: {
                message: 'Las extensiones permitidas son ' + validType.join(', ')
            }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            result: false,
            error: {
                message: 'Ningun archivo fue seleccionado.'
            }
        });
    }

    let fileToUpload = req.files.file;

    let validExtensions = ['png', 'gif', 'jpg', 'jpeg'];

    let sortedFileName = fileToUpload.name.split('.');
    let extension = sortedFileName[sortedFileName.length-1];

    if (validExtensions.indexOf( extension ) < 0){
        return res.status(400).json({
            result: false,
            error: {
                message: 'Las extensiones permitidas son ' + validExtensions.join(', ')
            }
        });
    }

    let fileName = `${ id }-${ new Date().getMilliseconds() }.${ extension }`

    fileToUpload.mv(`uploads/${ type }/${ fileName }`, function(error) {
        if (error){
            return res.status(500).json({
                result: false,
                error
            });
        }

        return res.status(200).json({
            result: true,
            successMessage: {
                message: 'Archivo guardado correctamente'
            }
        });
    });

});

module.exports = app;
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const User = require('../models/user');
const Product = require('../models/product');
const path = require('path');
const fs = require('fs');

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

    let fileName = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

    fileToUpload.mv(`uploads/${ type }/${ fileName }`, function(error) {
        if (error){
            return res.status(500).json({
                result: false,
                error
            });
        }

        if (type === 'users'){
            userImage(id, res, fileName)
        } else if (type === 'products') {
            productImage(id, res, fileName)
        }else {
            return res.status(400).json({
                result: false,
                error:{
                    message: `El tipo especificado para el path no es valido ${ validType.join(', ') }`
                }
            });
        }

    });

});

function userImage(id, res, fileName) {

    User.findById( id, (error, userDatabase) =>{

        if (error){
            deleteImage('users', fileName);
            return res.status(500).json({
                result: false,
                error
            })
        }else if (!userDatabase){
            deleteImage('users', fileName);
            return res.status(400).json({
                result: false,
                error:{
                    message: 'Usuario no existe'
                }
            })
        }else {

            deleteImage('users', userDatabase.img);

            userDatabase.img = fileName;

            userDatabase.save((error, userSaved) => {
                if (error){
                    deleteImage('users', userDatabase.img);
                    return res.status(500).json({
                        result: false,
                        error
                    })
                }else {
                    return res.status(200).json({
                        result: true,
                        userSaved,
                        img: fileName
                    })
                }

            })
        }

    });

}

function productImage(id, res, fileName) {
    Product.findById( id, (error, productDatabase) =>{

        if (error){
            deleteImage('products', fileName);
            return res.status(500).json({
                result: false,
                error
            })
        }else if (!productDatabase){
            deleteImage('products', fileName);
            return res.status(400).json({
                result: false,
                error:{
                    message: 'Producto no existe'
                }
            })
        }else {

            deleteImage('products', productDatabase.img);

            productDatabase.img = fileName;

            productDatabase.save((error, productSaved) => {
                if (error){
                    deleteImage('products', productDatabase.img);
                    return res.status(500).json({
                        result: false,
                        error
                    })
                }else {
                    return res.status(200).json({
                        result: true,
                        productSaved,
                        img: fileName
                    })
                }

            })
        }

    });

}

function deleteImage(type, imageName){
    let pathImage = path.resolve(__dirname, `../../uploads/${ type }/${ imageName}` );
    if ( fs.existsSync(pathImage) ){
        fs.unlinkSync(pathImage)
    }
}

module.exports = app;
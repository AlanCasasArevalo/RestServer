const express = require('express');
let { tokenVerification, adminRoleVerification } = require('../middlewares/authentication');
const app = express();
const Product = require('../models/product');
const _ = require('underscore');

app.get('/product',tokenVerification , (req, res) => {

    let fromSkip = req.query.from || 0;
    fromSkip = Number(fromSkip);
    let limit = req.query.limit || 5;
    limit = Number(limit);

    // Hacemos que solo nos devuelva los productos disponibles
    Product.find({ available : true })
        .sort('description')
        .populate('user', 'name email role')
        .populate('category')
        .skip(fromSkip)
        .limit(limit)
        .exec(( error, products ) => {
            if (error){
                return res.json(400).json({
                    result: false,
                    error
                })
            }

            Product.count({status: true}, (error, count) => {
                if (error){
                    return res.status(400).json({
                        result: false,
                        error
                    })
                }

                res.status(200).json({
                    result: true,
                    products,
                    count
                })

            })

        });
});

app.get('/product/:id', tokenVerification, (req, res) => {
    let id = req.params.id;

    Product.findById( id, (error, productDB) =>{
        if (error){
            return res.status(500).json({
                result: false,
                error
            })
        }

        if (!productDB){
            return res.status(400).json({
                result: false,
                error: {
                    message: 'El id mandado no es correcto'
                }
            })
        }

        res.status(200).json({
            result: true,
            productDB
        })

    });

});

app.get('/product/search/:parameterToSearch', tokenVerification, (req, res) => {
    let parameterToSearch = req.params.parameterToSearch;

    let regex = new RegExp(parameterToSearch, 'i');

    Product.find( { name: regex }, (error, productDB) =>{
        if (error){
            return res.status(500).json({
                result: false,
                error
            })
        }

        if (!productDB){
            return res.status(400).json({
                result: false,
                error: {
                    message: 'El id mandado no es correcto'
                }
            })
        }

        res.status(200).json({
            result: true,
            productDB
        })

    });

});

app.post('/product', [tokenVerification, adminRoleVerification], (req, res) => {
    let body = req.body;

    let product = new Product({
        user: req.user._id,
        name: body.name,
        uniquePrice: body.uniquePrice,
        description: body.description,
        available: body.available,
        category: body.category,
    });

    product.save( (error, productDataBase) => {
        if (error){
            return res.status(500).json({
                result : false,
                error
            })
        }

        if (!productDataBase){
            return res.status(400).json({
                result : false,
                error
            })
        }

        res.status(200).json({
            result: true,
            productDataBase
        })

    })
});

app.put('/product/:id', [tokenVerification, adminRoleVerification], (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Product.findByIdAndUpdate(id, body, {
        new: true,
    }, (error, productDataBase) => {

        if (error){
            return res.status(400).json({
                result: false,
                error
            })
        }

        if (!productDataBase){
            return res.status(400).json({
                result : false,
                error: {
                    message: 'El id requerido no es correcto'
                }
            })
        }

        productDataBase.name = body.name;
        productDataBase.uniquePrice = body.uniquePrice;
        productDataBase.description = body.description;
        productDataBase.available = body.available;
        productDataBase.category = body.category;

        productDataBase.save( (error, productSaved) =>{
            if (error){
                return res.status(500).json({
                    result: false,
                    error
                })
            }

            res.status(200).json({
                result: true,
                product: productSaved
            })

        });

    });

});

app.delete('/product/:id', [tokenVerification, adminRoleVerification], (req, res) => {
    let id = req.params.id;

    let statusChange = {
        status: false
    };

    Product.findByIdAndUpdate(id, statusChange,{
        new: true,
    }, (error, productDeleted) => {
        if (error){
            return res.status(400).json({
                result: false,
                error
            })
        }

        if (!productDeleted){
            return res.status(400).json({
                result: false,
                error: {
                    message: 'ID de product no encontrado.'
                }
            })
        }

        res.status(200).json({
            result: true,
            productDeleted
        })

    })

});

module.exports = app;
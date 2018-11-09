const express = require('express');
let { tokenVerification } = require('../middlewares/authentication');
let app = express();
const User = require('../models/user');
const Category = require('../models/category');
const _ = require('underscore');


/************************************************************************************
* TODAS LAS CATEGORIAS
*************************************************************************************/
app.get('/category', (req, res) => {

    let fromSkip = req.query.from || 0;
    fromSkip = Number(fromSkip);
    let limit = req.query.limit || 5;
    limit = Number(limit);

    Category.find()
        .skip(fromSkip)
        .limit(limit)
        .exec(( error, categories ) => {
            if (error){
                return res.json(400).json({
                    result: false,
                    error
                })
            }

            Category.count({status: true}, (error, count) => {
                if (error){
                    return res.status(400).json({
                        result: false,
                        error
                    })
                }

                res.status(200).json({
                    result: true,
                    categories,
                    count
                })

            })

        });

});

/************************************************************************************
* LA CATEGORIA POR ID
*************************************************************************************/
app.get('/category/:id', (req, res) => {
    // Category.findById
    let id = req.params.id;

    Category.findById( id, (error, category) =>{
        if (error){
            return res.status(400).json({
                result: false,
                error
            })
        }

        res.status(200).json({
            result: true,
            category
        })

    });

});

/************************************************************************************
* CREAR LA CATEGORIA
*************************************************************************************/
app.post('/category', (req, res) => {
    // devolver la categoria
    // req.user._id
    const body = req.body;

    let category = new Category({
        name: body.name,
    });

    category.save( (error, categoryDataBase) => {
       if (error){
           return res.status(400).json({
               result : false,
               error
           })
       }

       res.status(200).json({
           result: true,
           categoryDataBase
       })

    })

});

/************************************************************************************
* ACTUALIZA LA CATEGORIA
*************************************************************************************/
app.put('/category/:id', tokenVerification, (req, res) => {
    // devolver la categoria
    // req.user._id

    let id = req.params.id;
    let body = _.pick( req.body, ['name'] );

    Category.findByIdAndUpdate(id, body, {
        new: true,
    }, (error, categoryDataBase) => {

        if (error){
            return res.status(400).json({
                result: false,
                error
            })
        }

        res.status(200).json({
            result: true,
            category: categoryDataBase
        })
    });


});

/************************************************************************************
* BORRA LA CATEGORIA
*************************************************************************************/
app.delete('/category/:id', tokenVerification, (req, res) => {
    // solo admin puede borrar
    // tiene que ser solo si tiene un token
    // category.findByIdAndRemote

    let id = req.params.id;

    let statusChange = {
        status: false
    };

    Category.findByIdAndUpdate(id, statusChange,{
        new: true,
    }, (error, categoryDeleted) => {
        if (error){
            return res.status(400).json({
                result: false,
                error
            })
        }

        if (!categoryDeleted){
            return res.status(400).json({
                result: false,
                error: {
                    message: 'Categoria no encontrado.'
                }
            })
        }

        res.status(200).json({
            result: true,
            categoryDeleted
        })

    })

});

module.exports = app;

















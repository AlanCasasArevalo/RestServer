const express = require('express');
let { tokenVerification, adminRoleVerification } = require('../middlewares/authentication');
let app = express();
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
            return res.status(500).json({
                result: false,
                error
            })
        }

        if (!category){
            return res.status(400).json({
                result: false,
                error: {
                    message: 'El id mandado no es correcto'
                }
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
app.post('/category', tokenVerification, (req, res) => {
    let body = req.body;

    let category = new Category({
        description: body.description,
        user: req.user._id
    });

    category.save( (error, categoryDataBase) => {
       if (error){
           return res.status(500).json({
               result : false,
               error
           })
       }

       if (!categoryDataBase){
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
    let body = _.pick( req.body, ['description'] );

    Category.findByIdAndUpdate(id, body, {
        new: true,
    }, (error, categoryDataBase) => {

        if (error){
            return res.status(400).json({
                result: false,
                error
            })
        }

        if (!categoryDataBase){
            return res.status(400).json({
                result : false,
                error: {
                    message: 'El id requerido no es correcto'
                }
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
app.delete('/category/:id', [tokenVerification, adminRoleVerification], (req, res) => {

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
                    message: 'ID de categoria no encontrado.'
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

















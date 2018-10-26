
const express = require('express');
const app = express();

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

module.exports = app;
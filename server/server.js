const express = require('express')
const app = express()

app.get('/user', function(req, res) {
    res.json('GET user')
})

app.post('/user', function(req, res) {
    res.json('POST user')
})

app.put('/user/:id', function(req, res) {
    let id = req.params.id;

    res.json({
        id
    })
})

app.delete('/user', function(req, res) {
    res.json('DELETE user')
})

app.listen(3000, function () {
    console.log('Escuchando en el puerto 3000')
})


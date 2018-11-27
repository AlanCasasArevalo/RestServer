const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
let { tokenImageVerification } = require('../middlewares/authentication');

app.get('/image/:type/:image', tokenImageVerification, (req, res) =>{

    let type = req.params.type;
    let image = req.params.image;

    let pathImage = path.resolve(__dirname, `../../uploads/${ type }/${ image }` );

    let noImageFound = path.resolve(__dirname, `../assets/no-image.jpg`);

    if ( fs.existsSync(pathImage) ){
        res.sendFile(pathImage);
    }else {
        res.sendFile(noImageFound);
    }

});

module.exports = app;
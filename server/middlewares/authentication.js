const jwt = require('jsonwebtoken');

//********************
//  Verificafion de token
// ********************//

let tokenVerification = ( req, res, next ) => {
    let token = req.get('Authorization');

    jwt.verify( token, process.env.SEED, ( error, decoded ) => {
        if (error) {
            return res.status(401).json({
                result: false,
                error,
                message: 'El token no es valido'
            })
        }

        req.user = decoded.user;

        next();

    });

};


module.exports = {
    tokenVerification
};






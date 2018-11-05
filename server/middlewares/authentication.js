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
                error: {
                    message: 'El token no es valido'
                }
            })
        }

        req.user = decoded.user;

        next();

    });

};

//********************
//  Verificafion de Administracion
// ********************//

let adminRoleVerification = ( req, res, next ) => {
    
    let user = req.user;

    if (user.role === 'USER_ROLE'){
        return res.status(401).json({
            result: false,
            error: {
                message: 'El usuario no es administrador'
            }
        })
    }else {
        next();
    }

};


module.exports = {
    tokenVerification,
    adminRoleVerification
};






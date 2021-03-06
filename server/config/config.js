//********************
//  PORT
// ********************//

process.env.PORT = process.env.PORT || 3000;


//********************
//  ENVIRONMENT
// ********************//

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'


//********************
//  DDBB
// ********************//

let urlDDBB = '';

if (process.env.NODE_ENV === 'dev') {
    urlDDBB = 'mongodb://localhost:27017/cafe'
} else {
    urlDDBB = process.env.MONGO_URL
}

process.env.URLDDBB = urlDDBB;


//********************
//  Vencimiento de token
// ********************//

process.env.TOKEN_END_VALIDATION = 60 * 60 * 24 * 30;

//********************
//  SEED de autenticacion.
// ********************//
process.env.SEED = process.env.SEED || 'develop-secret-seed';

//********************
//  Google Client ID.
// ********************//
process.env.CLIENT_ID = process.env.CLIENT_ID || '676307275703-urekrt9tuovlte2vrbschm46s51815cr.apps.googleusercontent.com';

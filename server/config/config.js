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

if (process.env.NODE_ENV === 'dev'){
    urlDDBB = 'mongodb://localhost:27017/cafe'
} else {
    urlDDBB = 'mongodb://coffee-user:coffee-user123456@ds161092.mlab.com:61092/coffee'
}

process.env.URLDDBB = urlDDBB;





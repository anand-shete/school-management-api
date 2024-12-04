const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: 'school_management',
});
db.connect((err)=> {
    if(err) console.log('Db error',err)
    console.log('Db Connected');        
})
module.exports = db.promise();
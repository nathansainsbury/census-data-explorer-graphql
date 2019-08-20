const mysql = require('mysql');

const host = process.env.CENSUS_DATA_EXPLORER_SQL_HOST || 'localhost';
const user = process.env.CENSUS_DATA_EXPLORER_SQL_USER || 'root';
const password = process.env.CENSUS_DATA_EXPLORER_SQL_PASSWORD || 'password';
const database = process.env.CENSUS_DATA_EXPLORER_SQL_DATABASE || 'infuse2011';
const port = process.env.CENSUS_DATA_EXPLORER_SQL_PORT || 3306; 

const connection = mysql.createConnection({
    host,
    user,
    password,
    database,
    port
});

connection.connect();

module.exports = connection;

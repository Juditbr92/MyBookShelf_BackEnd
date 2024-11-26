const mysql = require('mysql2/promise')

async function createConnection() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'codenotch1805', 
        database: 'mybookshelf',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    })

    console.log('connection with the created database');
    return connection;
}

const connectionPromise = createConnection()

module.exports= { connectionPromise }
const {connectionPromise} = require('../../database')

let myBookShelf = {}

function getMyBookShelf(req, res) {
    if(myBookShelf) {
        res.send(myBookShelf)
    } else {
        res.status(404).send({error: true, code: 404, message: 'Database not found'})
    }
}

// EndPoints:


// To get all books from ONE USER: 

async function getBooksUser(req, res){
    const connection = await connectionPromise;
    try{
        const user_id = req.query.user_id
        const sql = `SELECT * FROM mybookshelf.books WHERE books.user_id=?`
        let [result] = await connection.query(sql, [user_id])
        res.send(result);
        console.log(result)
    }
    catch(error){
        console.log(error)
        res.status(500).send({error: true, message: "Could not get books from this user"})
    }
}


// To add a book: 

async function addBook(req, res){
    const connection = await connectionPromise
    try{
        const {title, author, type, photo, rating, notes, user_id} = req.body;
        await connection.query('INSERT INTO books (title, author, type, photo, rating, notes, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)', [title, author, type, photo, rating, notes, user_id])
        res.status(201).send({message: 'Book successfully added to your BookShelf'})
    } catch(error){
        console.log(error)
        res.status(500).send({error: true, message:'Book could not be added'})
    }
}

module.exports = { getMyBookShelf, addBook, getBooksUser}

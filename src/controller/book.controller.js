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

        if(!user_id) {
            return res.status(400).send({error: true, message:"User ID required"})
        }

        const sql = `SELECT * FROM mybookshelf.books WHERE books.user_id=?`
        let [result] = await connection.query(sql, [user_id])

        // Si no hay libros devolvemos mensaje vacio:
        if(result.length === 0){
            return res.status(404).send({error: false, message: "There are no books for this user", books: []});
        }

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
        if (!title || !author || !type || typeof rating !== 'number') {
            return res.status(400).json({ error: 'Invalid data' });
        }
        await connection.query('INSERT INTO books (title, author, type, photo, rating, notes, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)', [title, author, type, photo, rating, notes, user_id])
        res.status(201).send({message: 'Book successfully added to your BookShelf'})
    } catch(error){
        console.log(error)
        res.status(500).send({error: true, message:'Book could not be added'})
    }
}

// To delete a book: 

async function deleteBook(req, res){
    const connection = await connectionPromise
    try{  
        const book_id = req.query.book_id
        // comprobar que existe el libro:
        if (!book_id) {
            return res.status(400).send({ error: "Book ID is required" });
        }

        let result = await connection.query('DELETE FROM mybookshelf.books WHERE book_id = ?', [book_id])
        // Enviar error si no se pudo eliminar el libro
        if (result.affectedRows === 0) {
            return res.status(404).send({ error: "Book not found" });
        }
        res.status(200).send({
            code: 200,
            message: "Book deleted successfully"
        })
        console.log(result)
    }
    catch(error){
        res.status(500).send({ error: "An error occurred while deleting the book" });
    }
}

// Edit a book:

async function editBook(req, res){
    const connection = await connectionPromise;
    try{
        const book_id = req.body.book_id;

        if(!book_id){
            return res.send.status(400).send({error: true, message:("Book ID required")})
        }

        const {title, author, type, photo, rating, notes} = req.body;

        // Get the book from database: 
        const [rows] = await connection.query('SELECT * FROM books WHERE book_id = ?', [book_id])
        const bookToEdit = rows[0]

        if(!bookToEdit){
            return res.status(400).send({
                error: true, 
                message: "Book not found"
            })
        }

        // Modify data:
        const editTitle = title !== undefined ? title : bookToEdit.title;
        const editAuthor = author !== undefined ? author : bookToEdit.author;
        const editType = type !== undefined ? type : bookToEdit.type;
        const editPhoto = photo !== undefined ? photo : bookToEdit.photo;
        const editRating = rating !== undefined ? rating : bookToEdit.rating;
        const editNotes = notes !== undefined ? notes : bookToEdit.notes;

        // Add new data into table: 
        const [result] = await connection.query('UPDATE mybookshelf.books SET title = ?, author = ?, type = ?, photo = ?, rating = ?, notes = ? WHERE book_id = ?', [editTitle, editAuthor, editType, editPhoto, editRating, editNotes, book_id]);
        if(result.affectedRows === 0){
            return res.status(400).send({
                error: true, 
                message: "No changes have been made"
            })
        }

        const [updatedRows] = await connection.query('SELECT * FROM books WHERE book_id = ?', [book_id])
        const updatedBook = updatedRows[0]
        console.log("This book has been updated", [updatedBook])

        return res.status(200).send({
            error: false,
            message: "Book updated successfully"
        })
    } catch(error){
        res.status(500).send({ error: "An error occurred while editing the book" });
    }
}

module.exports = { getMyBookShelf, addBook, getBooksUser, deleteBook, editBook}

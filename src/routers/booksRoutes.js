const { Router } = require('express')
const router = Router()
const bookController = require('../controller/book.controller')

router.get('/books', bookController.getBooksUser)
router.post('/addBook', bookController.addBook)
router.delete('/books', bookController.deleteBook)
router.put('/books', bookController.editBook)

module.exports = router
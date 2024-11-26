const { Router } = require('express')
const router = Router()
const bookController = require('../controller/book.controller')

router.get('/books', bookController.getBooksUser)
router.post('/addBook', bookController.addBook)

module.exports = router
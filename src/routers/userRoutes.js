const { Router } = require('express')
const router = Router()
const userController = require('../controller/user.controller')

router.post('/register', userController.register)
router.post('/login', userController.login)
module.exports = router
const express = require('express')
const cors = require('cors')
const userRoutes = require('./src/routers/userRoutes')
const booksRoutes = require('./src/routers/booksRoutes')

const app = express()
app.use(cors());
app.use(express.urlencoded({extended: false }));
app.use(express.json());

app.set('port', 3000)
app.use(userRoutes)
app.use(booksRoutes)

module.exports = app
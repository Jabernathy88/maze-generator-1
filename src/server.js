require("dotenv").config()

const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const app = express()

// EJS
app.use(expressLayouts)
app.set('view engine', 'ejs')

// Built-in Bodyparser
app.use(express.urlencoded({ extended: true }))

// Routes
// app.use('/', require('./routes/index.js'))

const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`!! Maze server started on port ${PORT} !!`))

const axios = require('axios').default
const cors = require('cors')
const session = require('express-session')
const express = require('express')
const app = express()
const Database = require('@replit/database')
const db = new Database()

app.use(cors())
app.set('view engine', 'ejs');
app.use(express.static(__dirname))
app.use(express.json())

app.use(session({
  secret: process.env.APP_SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}))

// botMessage
app.use('/botMessage', require('./botMessage'))

module.exports = { axios, app, db }


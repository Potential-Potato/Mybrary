if (process.env.NODE_ENV !== 'production'){ //check if app is running on prod
    require('dotenv').config()
}

const express = require('express')
const app = express()
const bodyParser = require('body-parser')

//controller routes import
const indexRouter = require('./controller/index')
const authorRouter = require('./controller/authors')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(express.static('public')) //holds public files css etc
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL) 
const db = mongoose.connection
db.on('error', err => console.error(err))
db.once('open', () => console.log('Connected To Mongoose'))

//controller routes use
app.use('/', indexRouter)
app.use('/authors', authorRouter)

app.listen(process.env.PORT || 3000)


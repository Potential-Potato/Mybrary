const express = require('express')
const router = express.Router()
const bookModel = require('../models/book')

router.get('/', async (req, res) => {
    let books
    try {
         books = await bookModel.find().sort({ createdAt: 'desc'}).limit(10).exec()
    } catch {
        books = []
    }
    res.render('index', { bookObj: books })
})

module.exports = router
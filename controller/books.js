const express = require('express')
const router = express.Router()
const authorModel = require('../models/author')
const bookModel = require('../models/book')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']


//all books route
router.get('/', async (req, res) => {
    let query = bookModel.find()
    if(req.query.titleName != null && req.query.titleName != ''){
        query = query.regex('title', new RegExp(req.query.titleName, 'i'))
    }
    if(req.query.publishBefore != null && req.query.publishBefore != ''){
        query = query.lte('publishDate', req.query.publishBefore)
    }
    if(req.query.publishAfter != null && req.query.publishAfter != ''){
        query = query.gte('publishDate', req.query.publishAfter)
    }
    try{
        const books = await query.exec()
        res.render('books/index', {
        bookObj: books,
        searchOptions: req.query
          })
    }catch{
        res.redirect('/')
    }
})

//new books route
router.get('/new', async (req, res) => {
    renderNewPage(res, new bookModel())
})

//create new book route
router.post('/', async (req, res) => {
    const book = new bookModel({
        title: req.body.title,
        author: req.body.authorSelect,    
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description: req.body.description
    })
    saveCover(book, req.body.cover)

    try{
        const newBook = await book.save()
        // res.redirect(`books/${newBook.id}`)
        res.redirect('books')
    } catch (error) {
        renderNewPage(res, book, true)
    }
})
    

 async function renderNewPage(res, books, hasError = false) {
    try {
        const authors = await authorModel.find({})
        const params = {
            authorObj: authors,
            bookObj: books
        }
        if(hasError) params.errMsg = `Error creating book`
        res.render('books/new', params)
    } catch {
        res.redirect('books')
    }

}
function saveCover(book, coverEncoded){
    if(coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if(cover != null && imageMimeTypes.includes(cover.type)) {
        book.coverImage = new Buffer.from(cover.data, 'base64')
        book.coverImageType = cover.type
    }
}
module.exports = router
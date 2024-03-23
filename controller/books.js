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
        res.redirect(`books/${newBook.id}`)
    } catch (error) {
        renderNewPage(res, book, true)
    }
})
    
//needs npm method-override to use
router.get('/:id', async (req, res) => {
    try{
        //.populate() shows all the author data (database)
        const book = await bookModel.findById(req.params.id)
            .populate('author').exec()
        res.render('books/show', { book: book})
    } catch (err){
        console.log(err)
        res.redirect('/')
    }
})

//edit book route
router.get('/:id/edit', async (req, res) => {
    try{
        const book = await bookModel.findById(req.params.id)
        renderEditPage(res, book)
    }catch(err){
        console.log(err)
        res.redirect('/')
    }   
})


//create new book route
router.put('/:id', async (req, res) => {
    let book 
    try{
        book = await bookModel.findById(req.params.id)
        book.title = req.body.title
        book.author = req.body.authorSelect
        book.publishDate = new Date(req.body.publishDate)
        book.pageCount = req.body.pageCount
        book.description = req.body.description
        if  (req.body.cover != null && req.body.cover !== ''){
            saveCover(book, req.body.cover)
        }
        await book.save()
        res.redirect(`/books/${book.id}`)
    } catch (error) {
        console.log(error)
        if(book != null){
            renderEditPage(res, book, true)
        } else {
            
            redirect('/')
        }
        
    }
})

//delete book page
router.delete('/:id', async (req, res) => {
    let book
    try{
        book = await bookModel.findById(req.params.id)
        await book.deleteOne()
        res.redirect('/')
    } catch(err){
        console.debug(err)
        if(book != null ){
            res.render('books/show', {
                book: book,
                errMsg: 'Could not delete book'
            })
        } else {
            res.redirect('/')
        }
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

async function renderEditPage(res, books, hasError = false) {
    try {
        const authors = await authorModel.find({})
        const params = {
            authorObj: authors,
            bookObj: books
        }
        if(hasError) params.errMsg = `Error editing book`
        res.render('books/edit', params)
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
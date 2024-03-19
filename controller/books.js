const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const router = express.Router()
const authorModel = require('../models/author')
const bookModel = require('../models/book')
const uploadPath = path.join('public', bookModel.coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})


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
router.post('/', upload.single('cover'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null

    const book = new bookModel({
        title: req.body.title,
        author: req.body.authorSelect,    
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImageName: fileName,
        description: req.body.description
    })

    try{
        const newBook = await book.save()
        // res.redirect(`books/${newBook.id}`)
        res.redirect('books')
    } catch (error) {
        //shows error
        // console.error("Error creating book:", error); 
        // renderNewPage(res, book, true, error.message)
        if(book.coverImageName != null){
            removeBookCover(book.coverImageName)
        }
        renderNewPage(res, book, true)
    }
})
    
function removeBookCover(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.error(err)
    })
}

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
module.exports = router
const express = require('express')
const multer = require('multer')
const path = require('path')
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
  res.send('all books')
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
        author: req.body.author,    
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImageName: fileName,
        description: req.body.description
    })

    try{
        const newBook = await book.save()
        // res.redirect(`books/${newBook.id}`)
        res.redirect('books')
    } catch {
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
        if(hasError) params.errMsg = 'Error creating book'
        res.render('books/new', params)
    } catch (err){
        console.log(err)
        res.redirect('books')
    }

//    catch {
//     res.redirect('books')
// }
}
module.exports = router
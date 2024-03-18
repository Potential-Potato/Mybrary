const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
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
  res.send('All Books')
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
      const newBook = await bookModel.save()
      // res.redirect(`authors/${newAuthor.id}`)
      res.redirect('authors')
    }catch{
      renderNewPage(res, book, true)
    }
})

async function renderNewPage(res, books, hasError = false) {
  try{
    const authors = await authorModel.find({})  
    const params = {
      authorsObject: authors,
      bookObject: books
    }
    if(hasError) params.errorMessage = 'Error Creating Book'
    res.render('books/new', params)
  } catch {
    res.redirect('/books')
  }
}
    
module.exports = router
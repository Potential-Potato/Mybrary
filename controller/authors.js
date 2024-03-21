const express = require('express')
const router = express.Router()
const authorModel = require('../models/author')
const bookModel = require('../models/book')

//all authors route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if(req.query.searchName != null && req.query.searchName !== ''){
        searchOptions.name = new RegExp(req.query.searchName, 'i')
    }
    try{
        const authorS = await authorModel.find(searchOptions)
        res.render('authors/index', {
            zAuthors: authorS,
            searchOptions: req.query
            })
    }
    catch{
        res.redirect('/')
    }
})

//new authors route
router.get('/new', (req, res) => {
    res.render('authors/new', { cAuthor: authorModel()})
})

//create new author route
router.post('/', async (req, res) => {
    const author = new authorModel({
        name: req.body.nameBox
    })
    try{
        const newAuthor = await author.save()
        res.redirect(`authors/${newAuthor.id}`)
    }
    catch{
        res.render('authors/new', {
            cAuthor: author,
            errMsg: 'Error Creating Author'
        })
    }
})


//needs npm method-override to use
router.get('/:id', async (req, res) => {
    try {
        const author = await authorModel.findById(req.params.id)
        const book = await bookModel.find({ author: author.id }).limit(6).exec()
        res.render('authors/show', {
            author: author,
            booksByAuthor: book
        })
    } catch(err) {
        console.log(err)
        res.redirect('/')
    }
})

router.get('/:id/edit', async (req, res) => {
   try{
    const author = await authorModel.findById(req.params.id)
    res.render('authors/edit', { cAuthor: author})
   }catch{
    res.redirect('/authors')
   }
})

router.put('/:id', async (req, res) => {
    let author
    try{
        author = await authorModel.findById(req.params.id)
        author.name = req.body.nameBox
        await author.save()
        res.redirect(`/authors/${author.id}`)
    }
    catch{
        if(author == null ){
            res.redirect('/')
        }
        else{
            res.render('authors/edit', {
                cAuthor: author,
                errMsg: 'Error Updating Author'
            })
        }
    }
})

router.delete('/:id', async (req, res) => {
    let author
    try{
        author = await authorModel.findById(req.params.id)
        await author.deleteOne()
        res.redirect(`/authors`)
    } catch (err) { 
        if(author == null ){
            res.redirect('/')
        } else{
            res.redirect(`/authors/${author.id}`)
            console.log(err)
        }  
    }
})

module.exports = router
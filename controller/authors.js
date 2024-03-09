const express = require('express')
const router = express.Router()
const AuthorModel = require('../models/author')

//all authors route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if(req.query.searchName != null && req.query.searchName !== ''){
        searchOptions.name = new RegExp(req.query.searchName, 'i')
    }
    try{
        const authorS = await AuthorModel.find(searchOptions)
        res.render('authors/index', {
            rAuthors: authorS,
            searchOptions: req.query
            })
    }
    catch{
        res.redirect('/')
    }
})

//new authors route
router.get('/new', (req, res) => {
    res.render('authors/new', { author: new AuthorModel() })
})

//create new author route
router.post('/', async (req, res) => {
    const author = new AuthorModel({
        name: req.body.nameBox
    })
    try{
        const newAuthor = await author.save()
          // res.redirect(`authors/${newAuthor.id}`)
            res.redirect('authors')
    }
    catch{
        res.render('authors/new', {
            author: author,
            errMsg: 'Error Creating Author'
        })
    }
})
    
module.exports = router
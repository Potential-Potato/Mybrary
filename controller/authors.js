const express = require('express')
const router = express.Router()
const authorModel = require('../models/author')

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
    res.render('authors/new', { cAuthor: new authorModel() })
})

//create new author route
router.post('/', async (req, res) => {
    const author = new authorModel({
        name: req.body.nameBox
    })
    try{
        const newAuthor = await author.save()
          // res.redirect(`authors/${newAuthor.id}`)
            res.redirect('authors')
    }
    catch{
        res.render('authors/new', {
            xAuthor: author,
            errMsg: 'Error Creating Author'
        })
    }
})
    
module.exports = router
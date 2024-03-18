const mongoose = require('mongoose')

const coverImageBasePath = 'uploads/bookCovers'

//acts like a table in sql 
const booksSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    publishDate: {
        type: Date,
        required: true
    },
    pageCount: {
        type: Number,
        required: true
    },
    createdAtDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    coverImageName: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'authorModel'
    }
})

module.exports = mongoose.model('bookModel', booksSchema)
module.exports.coverImageBasePath = coverImageBasePath
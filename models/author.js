const mongoose = require('mongoose')

//acts like a table in sql 
const authorsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('authorModel', authorsSchema)
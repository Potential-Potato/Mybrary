const mongoose = require('mongoose')
const bookModel = require('./book')

//acts like a table in sql 
const authorsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

authorsSchema.pre("deleteOne", async function (next) {
    try {
        const query = this.getFilter();
        const hasBook = await bookModel.exists({ author: query._id });
  
        if (hasBook) {
            next(new Error("This author still has books."));
        } else {
            next();
        }
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('authorModel', authorsSchema)
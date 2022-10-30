const mongoose = require ('mongoose')

mongoose.connect('mongodb://localhost:27017/Admin-user-db',{
    useNewUrlParser : true,
    useUnifiedTopology : true
})


const categorySchema = mongoose.Schema ({
    category :{
        type:String,
        trim : true,
        required : true
    }
},{timestamps:true})

const Category = mongoose.model('Category',categorySchema)

module.exports = Category;
const mongoose =require('mongoose');

mongoose.connect('mongodb://localhost:27017/Admin-user-db',{
    useNewUrlParser : true,
    useUnifiedTopology : true
})



const productSchema = mongoose.Schema({
    name : {
        type : String,
        required : [true,'Please add all the details about your product']
    },
    price : {
        type : String,
        required : true
     },
    offer : {
        type : String,
    },
    category : {
        type : String,
        required : true
    },
    subCategory :{
        type:String,
    },
    stock : {
        type : String,
        required : true
    }, 
    image : {
        type : String,
    }, 
    description : {
        type : String,
        required : true
    }
},{timestamps:true})

const productModel = mongoose.model('product',productSchema);

module.exports = productModel;
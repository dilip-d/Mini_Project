const mongoose =require('mongoose');

mongoose.connect('mongodb://localhost:27017/Admin-user-db',{
    useNewUrlParser : true,
    useUnifiedTopology : true
})

const cartSchema = mongoose.Schema({

    name : {
        type:String
    },
    description: 
           { type: Object
        },
    price :{
        type:String
    },
    quantity :{
        type:String,
        min : 1,
        default : 1
    },
   
    price : {
        type: Number
    },

    category :{
        type:String,
    },
  
    image :{
        type:String,
    },
     orderStatus : {
        type : String,
        default:"none"
    },
    bill:{
        type:Number,
        required:true,
        default:0
    },
    stock: {
        type : Number
    }

},{timestamps:true})

const Cart = mongoose.model('Cart',cartSchema)

module.exports = Cart;
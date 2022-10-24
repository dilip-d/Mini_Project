const mongoose =require('mongoose');
const bcrypt = require("bcryptjs");

mongoose.connect('mongodb://localhost:27017/Admin-user-db',{
    useNewUrlParser : true,
    useUnifiedTopology : true
})

const adminSchema = mongoose.Schema({

    username : {
        type : String,
        trim : true,
        unique : true,
        required : [true,'Please enter username'],
        minLength : [4, 'Name is too short!']
    },

    password : {
        type : String,
        trim : true,
        required : [true,'Please enter a password'],
        minLength: [3,'Minimum password length is 3 characters']
    },
},{timestamps:true})


adminSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        return next();
    }
    
    this.password = await bcrypt.hashSync(this.password,10)
    next();
    })

adminSchema.methods.comparePassword = function(plainText,callback){
    console.log('comparing pw');
    return callback(null,bcrypt.compareSync(plainText,this.password))
}

//static method to login admin
adminSchema.statics.login = async function(username,password){
    const admin = await this.findOne({username});
    console.log('Found admin');
    if(admin){
        const auth = await bcrypt.compare(password,admin.password);
        if(auth){
            return admin;
        }
        throw Error('Incorrect password');    
    }
    throw Error('Incorrect username');   
}

//fire a function after doc saved to db
adminSchema.post('save',function(doc,next){
    console.log('new user was created & saved',doc);
    next();
})

const adminModel = mongoose.model('admin',adminSchema);

module.exports = adminModel;
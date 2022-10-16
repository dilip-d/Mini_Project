//handle errors
const handleErrors = (err)=>{
    console.log("before");
    console.log(err.message,err.code);

    let errors = {fname :'', lname:'',email: '', phonenumber:'',password: ''};

    //duplicate error code
    if(err.code === 11000){
        errors.email = 'That email is already registered';
        return errors;
    }
    console.log("after");

    //validation errors
    if(err.message.includes( 'user validation failed')){
      Object.values(err.errors).forEach(({properties})=>{
    errors[properties.path] = properties.message;
      });
    }
    console.log("hai test");
    return errors;
}

const loginerrorhandler = (err)=>{
    console.log("before");
    console.log(err.message);

    let errors = {email: '',password: ''};

    //incorrect email
    if(err.message === 'Incorrect email'){
    
        errors.email = 'Email is not registered';
        return errors;
    }

     //incorrect password
     if(err.message === 'Incorrect password'){
        errors.password = 'Password is incorrect';
        return errors;
    }

    //validation errors
    if(err.message.includes( 'user validation failed')){
      Object.values(err.errors).forEach(({properties})=>{
    errors[properties.path] = properties.message;
      });
    }
    console.log("hai test");
    return errors;
}
module.exports = {loginerrorhandler,handleErrors};

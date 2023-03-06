//handle errors
const handleErrors = (err) => {

  let errors = { fname: '', lname: '', email: '', phonenumber: '', password: '' };

  //duplicate error code
  if (err.code === 11000) {
    errors.email = 'That email is already registered';
    return errors;
  }
  console.log("after");

  //validation errors
  if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
}

const loginerrorhandler = (err) => {

  let errors = { email: '', password: '' };

  //incorrect email
  if (err.message === 'Incorrect email') {
    errors.email = 'Email is not registered';
    return errors;
  }
  //incorrect password
  if (err.message === 'Incorrect password') {
    errors.password = 'Password is incorrect';
    return errors;
  }
  //blocked user
  if (err.message === 'Your account is blocked') {
    errors.email = 'Your account is blocked !';
    return errors;
  }

  //validation errors
  if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
}
module.exports = { loginerrorhandler, handleErrors };

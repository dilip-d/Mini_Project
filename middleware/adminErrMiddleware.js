//handle errors
const adminHandleerror = (err) => {

  let errors = { username: '', password: '' };

  //incorrect username
  if (err.message === 'incorrect username') {
    errors.username = 'that username is not registered';
    return errors;
  }

  //incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'that password is incorrect';
    return errors;
  }

  //duplicate error code
  if (err.code === 11000) {
    errors.username = 'That username is already registered';
    return errors;
  }
  console.log("after");

  //validation errors
  if (err.message.includes('admin validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
}

const adminloginerrorhandler = (err) => {
  let adminerrors = { username: '', password: '' };

  //incorrect email
  if (err.message === 'Incorrect username') {

    adminerrors.username = 'Username is not registered';
    return adminerrors;
  }

  //incorrect password
  if (err.message === 'Incorrect password') {
    adminerrors.password = 'Password is incorrect';
    return adminerrors;
  }

  //validation errors
  if (err.message.includes('admin validation failed')) {
    Object.values(err.adminerrors).forEach(({ properties }) => {
      adminerrors[properties.path] = properties.message;
    });
  }
  return adminerrors;
}
module.exports = { adminHandleerror, adminloginerrorhandler };

const Validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateMobOTP(data) {
  let errors = {};

  data.mobile = !isEmpty(data.mobile) ? data.mobile : '';

 
  if (Validator.isEmpty(data.mobile)) {
    errors.mobile = 'Mobile Number is required';
  }

 
  return {
    errors,
    isValid: isEmpty(errors)
  };
};

const Validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateOTP(data) {
  let errors = {};

  data.otp = !isEmpty(data.otp) ? data.otp : '';

 
  if (Validator.isEmpty(data.otp)) {
    errors.otp = 'otp is required';
  }

 
  return {
    errors,
    isValid: isEmpty(errors)
  };
};

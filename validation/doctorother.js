const Validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateLoginInput(data) {
  let errors = {};

  data.cv = !isEmpty(data.cv) ? data.cv : '';
  data.current_hospital_address = !isEmpty(data.current_hospital_address) ? data.current_hospital_address : '';
  

 
  if (Validator.isEmpty(data.cv)) {
    errors.cv = 'cv field is required';
  }

  if (Validator.isEmpty(data.current_hospital_address)) {
    errors.current_hospital_address = 'Blood Group field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

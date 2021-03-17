const Validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateLoginInput(data) {
  let errors = {};

  data.cv = !isEmpty(data.cv) ? data.cv : '';
  data.current_hospital_address = !isEmpty(data.current_hospital_address) ? data.current_hospital_address : '';
  data.other_certificates = !isEmpty(data.other_certificates) ? data.other_certificates : '';


 
  if (Validator.isEmpty(data.cv)) {
    errors.cv = 'cv field is required';
  }

  if (Validator.isEmpty(data.current_hospital_address)) {
    errors.current_hospital_address = 'Blood Group field is required';
  }

  if (Validator.isEmpty(data.other_certificates)) {
    errors.other_certificates = 'other_certificates field is required';
  }
  

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

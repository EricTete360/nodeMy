const Validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateLoginInput(data) {
  let errors = {};

  data.profile_pic = !isEmpty(data.profile_pic) ? data.profile_pic : '';
  data.experience = !isEmpty(data.experience) ? data.experience : '';
  data.opd_fees = !isEmpty(data.opd_fees) ? data.opd_fees : '';
  data.gender = !isEmpty(data.gender) ? data.gender : '';
  data.language_proficiency = !isEmpty(data.language_proficiency) ? data.language_proficiency : '';
  data.current_address = !isEmpty(data.current_address) ? data.current_address : '';
  data.specialization = !isEmpty(data.specialization) ? data.specialization : '';

 
  if (Validator.isEmpty(data.profile_pic)) {
    errors.profile_pic = 'profile_pic field is required';
  }

  if (Validator.isEmpty(data.experience)) {
    errors.experience = 'experience field is required';
  }

  if (Validator.isEmpty(data.opd_fees)) {
    errors.opd_fees = 'OPD Fees field is required';
  }
  if (Validator.isEmpty(data.gender)) {
    errors.gender = 'Gender field is required';
  }
  if (Validator.isEmpty(data.language_proficiency)) {
    errors.language_proficiency = 'Language Proficiency field is required';
  }
  if (Validator.isEmpty(data.current_address)) {
    errors.current_address = 'Current Address field is required';
  }
  if (Validator.isEmpty(data.specialization)) {
    errors.specialization = 'Specialization field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

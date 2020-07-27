const Validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateLoginInput(data) {
  let errors = {};

  data.firstname = !isEmpty(data.firstname) ? data.firstname : '';
  data.lastname = !isEmpty(data.lastname) ? data.lastname : '';
  data.bloodGroup = !isEmpty(data.bloodGroup) ? data.bloodGroup : '';
  data.gender = !isEmpty(data.gender) ? data.gender : '';
  data.dateOfBirth = !isEmpty(data.dateOfBirth) ? data.dateOfBirth : '';
  data.mobileNumber = !isEmpty(data.mobileNumber) ? data.mobileNumber : '';
  data.alternateNumber = !isEmpty(data.alternateNumber) ? data.alternateNumber : '';
  data.address = !isEmpty(data.address) ? data.address : '';
  data.state = !isEmpty(data.state) ? data.state : '';
  data.pincode = !isEmpty(data.pincode) ? data.pincode : '';
  data.country = !isEmpty(data.country) ? data.country : '';
  data.professionalStatus = !isEmpty(data.professionalStatus) ? data.professionalStatus : '';
  data.profileImage = !isEmpty(data.profileImage) ? data.profileImage : '';

 
  if (Validator.isEmpty(data.firstname)) {
    errors.firstname = 'firstname field is required';
  }

  if (Validator.isEmpty(data.lastname)) {
    errors.lastname = 'lastname field is required';
  }

  if (Validator.isEmpty(data.bloodGroup)) {
    errors.bloodGroup = 'Blood Group field is required';
  }
  if (Validator.isEmpty(data.gender)) {
    errors.gender = 'Gender field is required';
  }
  if (Validator.isEmpty(data.dateOfBirth)) {
    errors.dateOfBirth = 'DOB field is required';
  }
  if (Validator.isEmpty(data.mobileNumber)) {
    errors.mobileNumber = 'Mobile Number field is required';
  }
  if (Validator.isEmpty(data.alternateNumber)) {
    errors.alternateNumber = 'Alternate Number field is required';
  }
  if (Validator.isEmpty(data.address)) {
    errors.address = 'Address field is required';
  }
  if (Validator.isEmpty(data.state)) {
    errors.state = 'State field is required';
  }
  if (Validator.isEmpty(data.pincode)) {
    errors.pincode = 'Pincode field is required';
  }
  if (Validator.isEmpty(data.country)) {
    errors.country = 'Country field is required';
  }
  if (Validator.isEmpty(data.professionalStatus)) {
    errors.professionalStatus = 'Professional Status field is required';
  }

  

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

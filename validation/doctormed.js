const Validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateLoginInput(data) {
  let errors = {};

  data.medical_certificate = !isEmpty(data.medical_certificate) ? data.medical_certificate : '';
  data.registration_no = !isEmpty(data.registration_no) ? data.registration_no : '';
  data.id_proof = !isEmpty(data.id_proof) ? data.id_proof : '';
  data.surgical_specialities = !isEmpty(data.surgical_specialities) ? data.surgical_specialities : '';
  data.physician_specialities = !isEmpty(data.physician_specialities) ? data.physician_specialities : '';
  data.hospital_schedule = !isEmpty(data.hospital_schedule) ? data.hospital_schedule : '';
  
 
  if (Validator.isEmpty(data.medical_certificate)) {
    errors.medical_certificate = 'medical_certificate field is required';
  }

  if (Validator.isEmpty(data.registration_no)) {
    errors.registration_no = 'registration_no field is required';
  }

  if (Validator.isEmpty(data.id_proof)) {
    errors.id_proof = 'id_proof field is required';
  }
  if (Validator.isEmpty(data.surgical_specialities)) {
    errors.surgical_specialities = 'surgical_specialities field is required';
  }
  if (Validator.isEmpty(data.physician_specialities)) {
    errors.physician_specialities = 'physician field is required';
  }
  if (Validator.isEmpty(data.hospital_schedule)) {
    errors.hospital_schedule = 'hospital schedule field is required';
  }
 
  return {
    errors,
    isValid: isEmpty(errors)
  };
};

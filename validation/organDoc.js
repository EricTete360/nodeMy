const Validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateOrganDocs(data) {
  let errors = {};

  data.idNumber = !isEmpty(data.idNumber) ? data.idNumber : '';
  data.idProofImage = !isEmpty(data.idProofImage) ? data.idProofImage : '';
  data.medDocument = !isEmpty(data.medDocument) ? data.medDocument : '';
  
 
  if (Validator.isEmpty(data.idNumber)) {
    errors.idNumber = 'idNumber field is required';
  }

  if (Validator.isEmpty(data.idProofImage)) {
    errors.idProofImage = 'Document is required';
  }

  if (Validator.isEmpty(data.medDocument)) {
    errors.medDocument = 'Document is required';
  }
  
  
  return {
    errors,
    isValid: isEmpty(errors)
  };
};

const Validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validatePatientDocs(data) {
  let errors = {};

  data.idNumber = !isEmpty(data.idNumber) ? data.idNumber : '';
  data.idProofImage = !isEmpty(data.idProofImage) ? data.idProofImage : '';
  data.medDocument = !isEmpty(data.medDocument) ? data.medDocument : '';
  data.medDocumentSecond = !isEmpty(data.medDocumentSecond) ? data.medDocumentSecond : '';
  data.medDocumentThird = !isEmpty(data.medDocumentThird) ? data.medDocumentThird : '';
  
 
  if (Validator.isEmpty(data.idNumber)) {
    errors.idNumber = 'idNumber field is required';
  }

  if (Validator.isEmpty(data.idProofImage)) {
    errors.idProofImage = 'Document is required';
  }

  if (Validator.isEmpty(data.medDocument)) {
    errors.medDocument = 'Document is required';
  }
  if (Validator.isEmpty(data.medDocumentSecond)) {
    errors.medDocumentSecond = 'Document is required';
  }
  if (Validator.isEmpty(data.medDocumentThird)) {
    errors.medDocumentThird = 'Document is required';
  }
  
  return {
    errors,
    isValid: isEmpty(errors)
  };
};

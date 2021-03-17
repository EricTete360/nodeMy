const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const DoctorMedSchema = new Schema({
  user: {
    //   Db relationship as in foreignkey
    type: Schema.Types.ObjectId,
    ref: 'doctors_login',
    
  },
  medical_certificate: {
    type: String,
    required: true
  },
  registration_no: {
    type: String,
    required: true
  },
  id_proof: {
    type: String,
    required: true
  },
  surgical_specialities: {
    type: String,
    required: true
  },
  physician_specialities: {
    type: String,
    required: true
  },
  hospital_schedule:{
    type:String,
  },
 
});

module.exports = DoctorMed = mongoose.model('doctors_med', DoctorMedSchema);

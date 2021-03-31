const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const PatientIntakeSchema = new Schema({
  user: {
    //   Db relationship as in foreignkey
    type: Schema.Types.ObjectId,
    ref: 'doctors_login',
  },
  intake: {
    type: String,
  },
  notes: {
    type: String,
  },
  
});

module.exports = PatientIntake = mongoose.model('patient_intake', PatientIntakeSchema);
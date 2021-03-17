const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const DoctorOtherSchema = new Schema({
  user: {
    //   Db relationship as in foreignkey
    type: Schema.Types.ObjectId,
    ref: 'doctors_login',
    
  },
  cv: {
    type: String,
   
  },
  special_achievement: {
    type: String,
   
  },
  current_hospital_address: {
    type: String,
   
  },
  other_certificates: {
    type: String,
   
  },

 
});

module.exports = DoctorOther = mongoose.model('doctors_other', DoctorOtherSchema);

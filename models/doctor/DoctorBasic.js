const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const DoctorBasicSchema = new Schema({
  user: {
    //   Db relationship as in foreignkey
    type: Schema.Types.ObjectId,
    ref: 'doctors_login',
  },
  profile_pic: {
    type: String,
    required: true
  },
  type_of_doctor: {
    type: String,
    required: true
  },
  experience: {
    type: String,
    required: true
  },
  opd_fees: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  language_proficiency: {
    type:String,
  },
  current_address:{
    type:String,
  },
  specialization:{
    type:String,
  },
  keyword:{
    type:String,
  },
  isVerified:{
    type: Boolean, 
    default: false
  },
});

module.exports = DoctorBasic = mongoose.model('doctors_basic', DoctorBasicSchema);
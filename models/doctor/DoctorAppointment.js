const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const DoctorAppointmentSchema = new Schema({
  user: {
    //   Db relationship as in foreignkey
    type: Schema.Types.ObjectId,
    ref: 'doctors_login',
  },

  isActive:{
    type: Boolean, 
    default: false
  },
  
});

module.exports = DoctorAppointment = mongoose.model('doctor_appointment', DoctorAppointmentSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const DoctorSlotSchema = new Schema({
  user: {
    //   Db relationship as in foreignkey
    type: Schema.Types.ObjectId,
    ref: 'doctors_login',
  },
  leave_date: {
    type: String,
  },
  due: {
    type: String,
  },
  
});

module.exports = DoctorSlot = mongoose.model('doctor_slot', DoctorSlotSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const BookingSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  doc_id: {
    type: String,
    required: true
  },
  doc_name: {
    type: String,
    required: true
  },
  patient_name: {
    type: String,
    required: true
  },
  time_slot: {
    type: String,
    required: true
  },
  hospital_address:{
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  booking_date:{
      type: String,
      required: true
  },
  isChecked:{
    type: Boolean, 
    default: false
  },
  creation_date: {
    type: Date,
    default: Date.now
  },
});


module.exports = Booking = mongoose.model('booking_schema', BookingSchema);
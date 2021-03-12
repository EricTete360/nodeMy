const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const DoctorLoginSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  resetToken:{
    type:String,
  },
  expireToken:{
    type:Date
  },
});

module.exports = DoctorLogin = mongoose.model('doctors_login', DoctorLoginSchema);

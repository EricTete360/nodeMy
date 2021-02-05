const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
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
  isVerified:{
    type: Boolean, 
    default: false
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

module.exports = User = mongoose.model('users', UserSchema);

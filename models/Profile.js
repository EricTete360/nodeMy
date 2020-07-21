const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ProfileSchema = new Schema({
  user: {
    //   Db relationship as in foreignkey
    type: Schema.Types.ObjectId,
    ref: 'users',
    
  },
  firstname: {
    type: String,
    required: true,
    },
  profileImage: {
    type: String,
    default:'Not Available'
    
  },
  lastname: {
    type: String,
    required:true
  },
  bloodGroup: {
    type: String,
    enum:['A +ve','A -ve','B +ve','B -ve','AB +ve','AB -ve','O +ve','O -ve',],
    required:true
    
  },
  gender: {
    type: String,
    enum:['Male','Female','Third gender'],
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  mobileNumber: {
    type: String,
    required:true
  },
  alternateNumber: {
    type: String,
    required:true
  },
  address: {
    type: String,
    required:true,
    max:150
  },
  state: {
    type: String,
    required:true
  },
  pincode: {
    type: String,
    required:true
  },
  country: {
    type: String,
    required:true
  },
  professionalStatus: {
    type: String,
    enum:['Private Employee','Government Employee','Business'],
    required:true
    
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);

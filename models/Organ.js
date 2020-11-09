const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const patient = new mongoose.Schema({
    user: {
        //   Db relationship as in foreignkey
        type: Schema.Types.ObjectId,
        ref: 'users',
        
    },
    idNumber:{
        type:String,
        required:true
    },
    idProofImage:{
        type:String,
        required:true
    },
    medDocument:{
        type:Array,
        required:true
    },

});

const donorDocs = new mongoose.Schema({
    user: {
        //   Db relationship as in foreignkey
        type: Schema.Types.ObjectId,
        ref: 'users',
        
    },
    idNumber:{
        type:String,
        required:true
    },
    idProofImage:{
        type:String,
        required:true
    },
    medDocument:{
        type:Array,
        required:true
    },
  
});


const donor = new mongoose.Schema({
    user: {
        //   Db relationship as in foreignkey
        type: Schema.Types.ObjectId,
        ref: 'users',
        
    },
    donordocuments:{
        type: Schema.Types.ObjectId,
        ref: 'donordocs',
        
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

const patientSchema = mongoose.model('patients',patient)
const donorSchema = mongoose.model('donors',donor)
const donorDocSchema = mongoose.model('donordocs',donorDocs)

module.exports = {Patient:patientSchema,Donor:donorSchema,DonorDocs:donorDocSchema}
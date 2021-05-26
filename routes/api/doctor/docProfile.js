const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../../config/keys');
const docauth = require('../../../middleware/docRequireLogin')

// In-out Validation
const validateDoctorBasic = require('../../../validation/doctorbasic');
const validateDoctorMed = require('../../../validation/doctormed');
const validateDoctorOther = require('../../../validation/doctorother');

// Models
const DoctorLogin = require('../../../models/doctor/Doctor');
const DoctorBasic = require('../../../models/doctor/DoctorBasic');
const DoctorMed = require('../../../models/doctor/DoctorMed');
const DoctorOther = require('../../../models/doctor/DoctorOther');



// User Registration
router.get('/docdet', (req, res) => {
    DoctorLogin.find()
      .then(user => res.json(user))
      .catch(err => res.status(404).json({ nouserfound: 'No doctor found' }));
});

router.get(
'/',
docauth,
(req, res) => {
    res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    mobile: req.user.mobile,
    });
}
);
  
// Doctor's Basic Details
router.get('/basic',docauth,(req,res)=>{
    console.log(req.user.name)
    const errors = {};
    DoctorBasic.findOne( {user:req.user.id })
            // res.json(req.user.name)
           .then(docbasic=>{
            //    console.log();
               if(!docbasic){
                   errors.noprofile = 'There is no profile,Complete The Profile details from settings';
                   return res.status(404).json(errors);

               }
               res.json(docbasic);
           }).catch(err => {
               console.log(err)
            res.status(401).json(err)
           }
                    
                    );
});
// @ POST REQUEST
// Create Doctor Basic Details Operation
router.post('/basic/create',
docauth,
(req,res)=>{

    // Validation
    const { errors, isValid } = validateDoctorBasic(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }
  

    const dbfields = {}; // to store doctor basic details
    dbfields.user = req.user.id; // to fetch authenticated user details
    if(req.body.profile_pic) dbfields.profile_pic = req.body.profile_pic;
    if(req.body.experience) dbfields.experience = req.body.experience;
    if(req.body.type_of_doctor) dbfields.type_of_doctor = req.body.type_of_doctor;
    if(req.body.opd_fees) dbfields.opd_fees = req.body.opd_fees;
    if(req.body.gender) dbfields.gender = req.body.gender;
    if(req.body.language_proficiency) dbfields.language_proficiency = req.body.language_proficiency;
    if(req.body.current_address) dbfields.current_address = req.body.current_address;
    if(req.body.specialization) dbfields.specialization = req.body.specialization;
    if(req.body.time_available) dbfields.time_available = req.body.time_available;
    if(req.body.keyword) dbfields.keyword = req.body.keyword;
     
    DoctorBasic.findOne({ user: req.user.id }).then(profile => {
        if (profile) {
            DoctorBasic.findOneAndUpdate(
                { user: req.user.id },
                { $set: dbfields },
                { new: true }
            ).then(profile => res.json(profile))
             .catch(err => res.json(err));
        } else {
            DoctorBasic.findOne({ current_address:dbfields.current_address }).then(profile=>{
                // Change it to mobile number
                
                if (profile) {
                    
                    new DoctorBasic(dbfields).save().then(profile => res.json(profile));

                }
                // else{
                //     errors.current_address = 'Profile Data already exists';
                //     res.status(400).json(errors);
                // }
                new DoctorBasic(dbfields).save().then(profile => res.json(profile));
            });
        }
    });


});
// @ PUT REQUEST
// Create Doctor Basic Details Operation
router.put('/basic/update',
docauth,
(req,res)=>{

    // Validation
    const { errors, isValid } = validateDoctorBasic(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }
  

    const dbfields = {}; // to store doctor basic details
    dbfields.user = req.user.id; // to fetch authenticated user details
    if(req.body.profile_pic) dbfields.profile_pic = req.body.profile_pic;
    if(req.body.experience) dbfields.experience = req.body.experience;
    if(req.body.type_of_doctor) dbfields.type_of_doctor = req.body.type_of_doctor;
    if(req.body.opd_fees) dbfields.opd_fees = req.body.opd_fees;
    if(req.body.gender) dbfields.gender = req.body.gender;
    if(req.body.language_proficiency) dbfields.language_proficiency = req.body.language_proficiency;
    if(req.body.current_address) dbfields.current_address = req.body.current_address;
    if(req.body.specialization) dbfields.specialization = req.body.specialization;
    if(req.body.keyword) dbfields.keyword = req.body.keyword;
    if(req.body.time_available) dbfields.time_available = req.body.time_available;
    if(req.body.isVerified) dbfields.isVerified = req.body.isVerified;
     
    DoctorBasic.findOne({ user: req.user.id }).then(profile => {
        if (profile) {
            DoctorBasic.updateOne(
                { user: req.user.id },
                { $set: dbfields },
                { new: true }
            ).then(profile => res.json(profile))
             .catch(err => res.json(err));
        } 
    
    });


});


// Doctor's Medical Certificate
router.get('/medical',docauth,(req,res)=>{
    console.log(req.user.name)
    const errors = {};
    DoctorMed.findOne( {user:req.user.id })
            // res.json(req.user.name)
           .then(docmed=>{
               console.log();
               if(!docmed){
                   errors.noprofile = 'There is no profile,Complete The Profile details from settings';
                   return res.status(404).json(errors);

               }
               res.json(docmed);
           }).catch(err => {
            res.status(401).json(err)
           }
                    
                    );
});
// @ POST REQUEST
// Create Doctor Basic Details Operation
router.post('/medical/create',
docauth,
(req,res)=>{

    // Validation
    const { errors, isValid } = validateDoctorMed(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }
  

    const dbfields = {}; // to store doctor basic details
    dbfields.user = req.user.id; // to fetch authenticated user details
    if(req.body.medical_certificate) dbfields.medical_certificate = req.body.medical_certificate;
    if(req.body.registration_no) dbfields.registration_no = req.body.registration_no;
    if(req.body.id_proof) dbfields.id_proof = req.body.id_proof;
    if(req.body.surgical_specialities) dbfields.surgical_specialities = req.body.surgical_specialities;
    if(req.body.physician_specialities) dbfields.physician_specialities = req.body.physician_specialities;
    if(req.body.hospital_schedule) dbfields.hospital_schedule = req.body.hospital_schedule;
    
     
    DoctorMed.findOne({ user: req.user.id }).then(profile => {
        if (profile) {
            DoctorMed.findOneAndUpdate(
                { user: req.user.id },
                { $set: dbfields },
                { new: true }
            ).then(profile => res.json(profile))
             .catch(err => res.json(err));
        } else {
            DoctorMed.findOne({ registration_no:dbfields.registration_no }).then(profile=>{
                // Change it to mobile number
                if (profile) {
                    errors.registration_no = 'Profile Data already exists';
                    res.status(400).json(errors);
                    // new DoctorMed(dbfields).save().then(profile => res.json(profile));
                }
                
                new DoctorMed(dbfields).save().then(profile => res.json(profile));
            });
        }
    });


});
// @ PUT REQUEST
// Create Doctor Medical Details Operation
router.put('/medical/update',
docauth,
(req,res)=>{

    // Validation
    const { errors, isValid } = validateDoctorMed(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }
  

    const dbfields = {}; // to store doctor basic details
    dbfields.user = req.user.id; // to fetch authenticated user details
    if(req.body.medical_certificate) dbfields.medical_certificate = req.body.medical_certificate;
    if(req.body.registration_no) dbfields.registration_no = req.body.registration_no;
    if(req.body.id_proof) dbfields.id_proof = req.body.id_proof;
    if(req.body.surgical_specialities) dbfields.surgical_specialities = req.body.surgical_specialities;
    if(req.body.physician_specialities) dbfields.physician_specialities = req.body.physician_specialities;
    if(req.body.hospital_schedule) dbfields.hospital_schedule = req.body.hospital_schedule;
     
    DoctorMed.findOne({ user: req.user.id }).then(profile => {
        if (profile) {
            DoctorMed.updateOne(
                { user: req.user.id },
                { $set: dbfields },
                { new: true }
            ).then(profile => res.json(profile))
             .catch(err => res.json(err));
        } 
    
    });


});

// Doctor's Other details
router.get('/other',docauth,(req,res)=>{
    console.log(req.user.name)
    const errors = {};
    DoctorOther.findOne( {user:req.user.id })
            // res.json(req.user.name)
           .then(docother=>{
               console.log();
               if(!docother){
                   errors.noprofile = 'There is no profile,Complete The Profile details from settings';
                   return res.status(404).json(errors);

               }
               res.json(docother);
           }).catch(err => {
            res.status(401).json(err)
           }
                    
                    );
});
// @ POST REQUEST
// Create Doctor Other Details Operation
router.post('/other/create',
docauth,
(req,res)=>{

    // Validation
    const { errors, isValid } = validateDoctorOther(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }
  

    const dbfields = {}; // to store doctor basic details
    dbfields.user = req.user.id; // to fetch authenticated user details
    if(req.body.cv) dbfields.cv = req.body.cv;
    if(req.body.special_achievement) dbfields.special_achievement = req.body.special_achievement;
    if(req.body.current_hospital_address) dbfields.current_hospital_address = req.body.current_hospital_address;
    if(req.body.other_certificates) dbfields.other_certificates = req.body.other_certificates;
     
    DoctorOther.findOne({ user: req.user.id }).then(profile => {
        if (profile) {
            DoctorOther.findOneAndUpdate(
                { user: req.user.id },
                { $set: dbfields },
                { new: true }
            ).then(profile => res.json(profile))
             .catch(err => { 
                    console.log(err)
                    res.json(err)
                });
        } else {
            DoctorOther.findOne({ current_hospital_address:dbfields.current_hospital_address }).then(profile=>{
                // Change it to mobile number
                
                if (profile) {
                    errors.current_hospital_address = 'Profile Data already exists';
                    res.status(400).json(errors);
                }
                new DoctorOther(dbfields).save().then(profile => res.json(profile));
            });
        }
    });


});
// @ PUT REQUEST
// Create Doctor Basic Details Operation
router.put('/other/update',
docauth,
(req,res)=>{

    // Validation
    const { errors, isValid } = validateDoctorOther(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }
  
    const dbfields = {}; // to store doctor basic details
    dbfields.user = req.user.id; // to fetch authenticated user details
    if(req.body.cv) dbfields.cv = req.body.cv;
    if(req.body.special_achievement) dbfields.special_achievement = req.body.special_achievement;
    if(req.body.current_hospital_address) dbfields.current_hospital_address = req.body.current_hospital_address;
    if(req.body.other_certificates) dbfields.other_certificates = req.body.other_certificates; 
    
    DoctorOther.findOne({ user: req.user.id }).then(profile => {
        if (profile) {
            DoctorOther.updateOne(
                { user: req.user.id },
                { $set: dbfields },
                { new: true }
            ).then(profile => res.json(profile))
             .catch(err => res.json(err));
        } 
    
    });


});
  
module.exports = router;


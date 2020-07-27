const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const fileUpload = require('express-fileupload');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');



// Validation
const validateOrganDocument = require('../../validation/organDoc');
const validateDonorDocument = require('../../validation/donorform');



// Models
const { Donor } = require('../../models/Organ');
const { DonorDocs } = require('../../models/Organ');



// Donor Document Fetching
router.get('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const errors = {};
    DonorDocs.findOne({ user: req.user.id })
           .then(donordocs=>{
               if(!donordocs){
                   errors.noprofile = 'There is no document,Upload Documents to view';
                   return res.status(404).json(errors);

               }
               res.json(donordocs);
           }).catch(err => res.status(404).json(err));
});


// Donor Document Upload
router.post('/donorDocs',
passport.authenticate('jwt',{session:false}),
(req,res)=>{

    // Validation
    const { errors, isValid } = validateOrganDocument(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }
  

    const donrdocs = {}; // to store profile details
    donrdocs.user = req.user.id; // to fetch authenticated user details
    
    if(req.body.idNumber) donrdocs.idNumber = req.body.idNumber;
    if(req.body.idProofImage) donrdocs.idProofImage = req.body.idProofImage;
    if(req.body.medDocument) donrdocs.medDocument = req.body.medDocument;
    if(req.body.medDocumentSecond) donrdocs.medDocumentSecond = req.body.medDocumentSecond;
    if(req.body.medDocumentThird) donrdocs.medDocumentThird = req.body.medDocumentThird;
    
    
    
    DonorDocs.findOne({ user: req.user.id }).then(donordocs => {
        if (donordocs) {
            DonorDocs.findOneAndUpdate(
                { user: req.user.id },
                { $set: donrdocs },
                { new: true }
            ).then(donordocs => res.json(donordocs))
             .catch(err => res.json(err));
        } else {
            DonorDocs.findOne({ idNumber:donrdocs.idNumber }).then(donordocs=>{
                // Change it to mobile number
                
                if (donordocs) {
                    errors.idNumber = 'Number already exists';
                    res.status(400).json(errors);
                }
                new DonorDocs(donordocs).save().then(donordc => res.json(donordc));
            });
        }
    });


});


// Get Donor

router.get('/donordetails',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const errors = {};
    Donor.findOne({ user: req.user.id })
           .then(donor=>{
               if(!donor){
                   errors.noprofile = 'Details not available,Complete The donor details.';
                   return res.status(404).json(errors);

               }
               res.json(donor);
           }).catch(err => res.status(404).json(err));
});



// Create Donor Post Operation
router.post('/donorform',
passport.authenticate('jwt',{session:false}),
(req,res)=>{

    // Validation
    const { errors, isValid } = validateDonorDocument(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }
  

    const donorfields = {}; // to store profile details
    donorfields.user = req.user.id; // to fetch authenticated user details
    if(req.body.firstname) donorfields.firstname = req.body.firstname;
    if(req.body.lastname) donorfields.lastname = req.body.lastname;
    if(req.body.bloodGroup) donorfields.bloodGroup = req.body.bloodGroup;
    if(req.body.gender) donorfields.gender = req.body.gender;
    if(req.body.dateOfBirth) donorfields.dateOfBirth = req.body.dateOfBirth;
    if(req.body.mobileNumber) donorfields.mobileNumber = req.body.mobileNumber;
    if(req.body.alternateNumber) donorfields.alternateNumber = req.body.alternateNumber;
    if(req.body.address) donorfields.address = req.body.address;
    if(req.body.state) donorfields.state = req.body.state;
    if(req.body.pincode) donorfields.pincode = req.body.pincode;
    if(req.body.country) donorfields.country = req.body.country;
    if(req.body.professionalStatus) donorfields.professionalStatus = req.body.professionalStatus;
    if(req.body.profileImage) donorfields.profileImage = req.body.profileImage;
    
    
    Donor.findOne({ user: req.user.id }).then(donorprofile => {
        if (donorprofile) {
            Donor.findOneAndUpdate(
                { user: req.user.id },
                { $set: donorfields },
                { new: true }
            ).then(donorprofile => res.json(donorprofile))
             .catch(err => res.json(err));
        } else {
            Donor.findOne({ mobileNumber:donorfields.mobileNumber }).then(donorprofile=>{
                // Change it to mobile number
                
                if (donorprofile) {
                    errors.mobileNumber = 'Donor Data already exists';
                    res.status(400).json(errors);
                }
                new Donor(donorfields).save().then(donorprofile => res.json(donorprofile));
            });
        }
    });


});


module.exports = router;
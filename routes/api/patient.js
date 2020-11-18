const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');



// Validation
const validatePatientDocument = require('../../validation/patientDoc');


// Middleware
const userloginrequire = require('../../middleware/userRequireLogin');

// Models
const  Patient  = require('../../models/Organ');


// Patient Document Fetching
router.get('/',userloginrequire,(req,res)=>{
    const errors = {};
    Patient.findOne({ user: req.user.id })
           .then(patient=>{
               if(!patient){
                   errors.noprofile = 'There is no document,Upload Documents to view';
                   return res.status(404).json(errors);

               }
               res.json(patient);
           }).catch(err => res.status(404).json(err));
});


// Patient Document Upload
router.post('/patientDocs',
userloginrequire,
(req,res)=>{

    // Validation
    const { errors, isValid } = validatePatientDocument(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }
  

    const patientdocs = {}; // to store profile details
    patientdocs.user = req.user.id; // to fetch authenticated user details
    
    if(req.body.idNumber) patientdocs.idNumber = req.body.idNumber;
    if(req.body.idProofImage) patientdocs.idProofImage = req.body.idProofImage;
    if(req.body.medDocument) patientdocs.medDocument = req.body.medDocument;
    // if(req.body.medDocumentSecond) patientdocs.medDocumentSecond = req.body.medDocumentSecond;
    // if(req.body.medDocumentThird) patientdocs.medDocumentThird = req.body.medDocumentThird;
    
    // {"url": "http://res.cloudinary.com/drvk8qbzb/image/upload/v1604735956/JivandeepImages/bgx5hr4vaxtwurluwusy.png"},
    // "medDocument": [
    //     {"url": "http://res.cloudinary.com/drvk8qbzb/image/upload/v1604735956/JivandeepImages/bgx5hr4vaxtwurluwusy.png"},
    //     {"url": "http://res.cloudinary.com/drvk8qbzb/image/upload/v1604735956/JivandeepImages/bgx5hr4vaxtwurluwusy.png"}
    // ]
    
    Patient.findOne({ user: req.user.id }).then(patient => {
        
        if (patient) {
            Patient.findOneAndUpdate(
                { user: req.user.id },
                { $set: patientdocs },
                { new: true }
            ).then(patient => res.json(patient))
             .catch(err => console.log(err));
        } else {
            Patient.findOne({ idNumber:patientdocs.idNumber }).then(patient=>{
                // Change it to mobile number
                
                if (patient) {
                    errors.idNumber = 'Number already exists';
                    res.status(400).json(errors);
                }
                new Patient(patientdocs).save().then(patient => res.json(patient));
            });
        }
    });


});




module.exports = router;
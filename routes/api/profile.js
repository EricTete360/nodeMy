const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const fileUpload = require('express-fileupload');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');



// Validation
const validateProfileInput = require('../../validation/profile');
const validatePasswordInput = require('../../validation/passChange');


// Models
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { use } = require('passport');

router.use(fileUpload());
// Get Profile

router.get('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const errors = {};
    Profile.findOne({ user: req.user.id })
           .then(profile=>{
               if(!profile){
                   errors.noprofile = 'There is no profile,Complete The Profile details from settings';
                   return res.status(404).json(errors);

               }
               res.json(profile);
           }).catch(err => res.status(404).json(err));
});



// Create Profile Post Operation
router.post('/fillProfile',
passport.authenticate('jwt',{session:false}),
(req,res)=>{

    // Validation
    const { errors, isValid } = validateProfileInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }
  

    const profilefields = {}; // to store profile details
    profilefields.user = req.user.id; // to fetch authenticated user details
    // const prof_image = req.files.profileImage;
    // prof_image.mv('./public/profilePictures/' + prof_image.name)
    if(req.body.firstname) profilefields.firstname = req.body.firstname;
    if(req.body.lastname) profilefields.lastname = req.body.lastname;
    if(req.body.bloodGroup) profilefields.bloodGroup = req.body.bloodGroup;
    if(req.body.gender) profilefields.gender = req.body.gender;
    if(req.body.dateOfBirth) profilefields.dateOfBirth = req.body.dateOfBirth;
    if(req.body.mobileNumber) profilefields.mobileNumber = req.body.mobileNumber;
    if(req.body.alternateNumber) profilefields.alternateNumber = req.body.alternateNumber;
    if(req.body.address) profilefields.address = req.body.address;
    if(req.body.state) profilefields.state = req.body.state;
    if(req.body.pincode) profilefields.pincode = req.body.pincode;
    if(req.body.country) profilefields.country = req.body.country;
    if(req.body.professionalStatus) profilefields.professionalStatus = req.body.professionalStatus;
    if(req.body.profileImage) profilefields.profileImage = req.body.profileImage;
    // if(prof_image) profilefields.prof_image = prof_image;
    
    
    Profile.findOne({ user: req.user.id }).then(profile => {
        if (profile) {
            Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profilefields },
                { new: true }
            ).then(profile => res.json(profile))
             .catch(err => res.json(err));
        } else {
            Profile.findOne({ dateOfBirth:profilefields.dateOfBirth }).then(profile=>{
                if (profile) {
                    errors.dateOfBirth = 'Profile Data already exists';
                    res.status(400).json(errors);
                }
                new Profile(profilefields).save().then(profile => res.json(profile));
            });
        }
    });


});


// Update Profile PUT operation
router.put('/editProfile',
passport.authenticate('jwt',{session:false}),
(req,res)=>{

    // Validation
    const { errors, isValid } = validateProfileInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }
  

    const profilefields = {}; // to store profile details
    profilefields.user = req.user.id; // to fetch authenticated user details
    // const prof_image = req.files.profileImage;
    // prof_image.mv('./public/profilePictures/' + prof_image.name)
    if(req.body.firstname) profilefields.firstname = req.body.firstname;
    if(req.body.lastname) profilefields.lastname = req.body.lastname;
    if(req.body.bloodGroup) profilefields.bloodGroup = req.body.bloodGroup;
    if(req.body.gender) profilefields.gender = req.body.gender;
    if(req.body.dateOfBirth) profilefields.dateOfBirth = req.body.dateOfBirth;
    if(req.body.mobileNumber) profilefields.mobileNumber = req.body.mobileNumber;
    if(req.body.alternateNumber) profilefields.alternateNumber = req.body.alternateNumber;
    if(req.body.address) profilefields.address = req.body.address;
    if(req.body.state) profilefields.state = req.body.state;
    if(req.body.pincode) profilefields.pincode = req.body.pincode;
    if(req.body.country) profilefields.country = req.body.country;
    if(req.body.professionalStatus) profilefields.professionalStatus = req.body.professionalStatus;
    if(req.body.profileImage) profilefields.profileImage = req.body.profileImage;
    // if(prof_image) profilefields.prof_image = prof_image;
    
    
    Profile.findOne({ user: req.user.id }).then(profile => {
        if (profile) {
            Profile.updateOne(
                { user: req.user.id },
                { $set: profilefields },
                { new: true }
            ).then(profile => res.json(profile))
             .catch(err => res.json(err));
        } 
        // else {
        //     return err=>res.status(400).json(err);
        // }
    });


});



// User Password Change
router.put('/password-change',passport.authenticate('jwt', { session: false }),(req,res)=>{

    const { errors, isValid } = validatePasswordInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const passfields = {}; // to store profile details
    passfields.user = req.user.id; // to fetch authenticated user details

    const newPassword = req.body.newPassword;
    const confirmPassword = req.body.confirmPassword;
    User.findOne({user: req.user.id})
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"Not Authorised"})
        }
        bcrypt.hash(newPassword,12).then(hashedpassword=>{
            // user.password = hashedpassword
            // user.save().then((saveduser)=>{
            //     res.json({message:"Password Changed Successfully"})
            // })
            User.updateOne(  
                { user: req.user.id },
                { $set: {newPassword,password} },
                { new: true }).then(user=>res.json(user))
                              .catch(err=>res.json(err));

        })
    }).catch(err=>{
        console.log(err);
    })

});




module.exports = router;

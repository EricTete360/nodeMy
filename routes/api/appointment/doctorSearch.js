const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../../config/keys');


// Middleware
const userloginrequire = require('../../../middleware/userRequireLogin');

const DoctorBasic = require('../../../models/doctor/DoctorBasic');
const Booking = require('../../../models/Appointment/Booking');
// for frontend users
// GET REQUEST OF Questions
router.get('/doctorslist',userloginrequire, (req, res) => {
    DoctorBasic.find().populate("user")
      .then(docs => res.status(200).json(docs))
      .catch(err => res.status(404).json({ nodocfound: {msg:'No doctors found',reason:err} }));
});
// 
router.get('/doctor/:id',userloginrequire, (req, res) => {
  DoctorBasic.findOne({_id:req.params.id}).populate("user")
    .then(docs => res.status(200).json(docs))
    .catch(err => res.status(404).json({ nodocfound: {msg:'No doctor found',reason:err} }));
});

router.get('/bookinglist',userloginrequire,(req,res)=>{
  Booking.findOne({user:req.user.id})
         .then(list => { 
          if(!list){
            return res.status(404).json({ msg:"No Booking Found" });

           }
           res.json(list);
          })
         .catch(err => { res.status(401).json(err) })
})

router.post('/bookappointment',userloginrequire,(req,res)=>{
  const {doc_id,doc_name,patient_name,time_slot,phone,booking_date,hospital_address} = req.body ;

  if (!doc_id||!doc_name||!patient_name||!time_slot||!phone||!booking_date || !hospital_address) {
    return res.status(422).json({ error:"Please Add All Details" });
  }

  const newBooking = new Booking({
    user : req.user.id,
    doc_id : req.body.doc_id,
    doc_name : req.body.doc_name,
    patient_name : req.body.patient_name,
    time_slot : req.body.time_slot,
    phone : req.body.phone,
    hospital_address : req.body.hospital_address,
    booking_date : req.body.booking_date,
  })
  newBooking.save()
            .then(book=>{res.status(200).json(book)})
            .catch(err=>{ res.status(403).json(err)})

});






module.exports = router;


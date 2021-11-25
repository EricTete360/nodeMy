const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../../config/keys');

// Middleware
const userloginrequire = require('../../../middleware/userRequireLogin');
const EnquiryFormdet = require('../../../models/formDetails/EnquiryForm');


// for frontend users
// GET REQUEST OF Questions
router.get('/enquiryformview', (req, res) => {
    EnquiryFormdet.find()
      .then(enq => res.json(enq))
      .catch(err => res.status(404).json({ noformsfound: 'No enquiry found' }));
  });


router.post('/enqaddform',(req,res)=>{
    const addinfo = new EnquiryFormdet({
        // user:req.user.id,
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        email:req.body.email,
        mobile:req.body.mobile,
        service:req.body.service,
    });
    addinfo.save().then(resp=>{res.json(resp)}).catch(err=>res.json(err));    
});



module.exports = router;


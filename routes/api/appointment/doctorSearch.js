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

// for frontend users
// GET REQUEST OF Questions
router.get('/doctorslist',userloginrequire, (req, res) => {
    DoctorBasic.find().populate("user")
      .then(docs => res.status(200).json(docs))
      .catch(err => res.status(404).json({ noquesfound: {msg:'No questions found',reason:err} }));
});





module.exports = router;


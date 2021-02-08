const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../../config/keys');


// Middleware
const userloginrequire = require('../../../middleware/userRequireLogin');

const Questions = require('../../../models/formDetails/Questions');
const Answer = require('../../../models/formDetails/Answers');

// for frontend users
// GET REQUEST OF Questions
router.get('/questionLists',userloginrequire, (req, res) => {
    Questions.find()
      .then(ques => res.json(ques))
      .catch(err => res.status(404).json({ noquesfound: 'No questions found' }));
  });



// Answering Questions API and Recording Response api
// For frontend users responding request
router.post('/answer',userloginrequire,(req,res)=>{
    const response = new Answer({
        user:req.user.id,
        questionID:req.body.questionID,
        answer:req.body.answer,
    });
    response.save().then(respa => res.json(respa));  
});



module.exports = router;

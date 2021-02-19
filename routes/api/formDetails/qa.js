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
const PatientQuestion = require('../../../models/formDetails/PatientQues');
const DonorQuestion = require('../../../models/formDetails/DonorQues');
const Answer = require('../../../models/formDetails/Answers');

// for frontend users
// GET REQUEST OF Questions
router.get('/questionLists',userloginrequire, (req, res) => {
    Questions.find()
      .then(ques => res.json(ques))
      .catch(err => res.status(404).json({ noquesfound: 'No questions found' }));
  });

// for frontend users
// GET REQUEST OF Questions
router.get('/patientquestionLists',userloginrequire, (req, res) => {
    PatientQuestion.find()
      .then(ques => res.json(ques))
      .catch(err => res.status(404).json({ noquesfound: 'No questions found' }));
  });

  // for frontend users
// GET REQUEST OF Questions
router.get('/donorquestionLists',userloginrequire, (req, res) => {
    DonorQuestion.find()
      .then(ques => res.json(ques))
      .catch(err => res.status(404).json({ noquesfound: 'No questions found' }));
  });


// Answering Questions API and Recording Response api
// For frontend users responding request
router.post('/answer',userloginrequire,(req,res)=>{
    const _id = req.body.id;
    Questions.findOne({_id}).then(postAnswer=>{
        const userAnswer = {
            user:req.user.id,
            answer:req.body.answer,
        };
        postAnswer.response.unshift(userAnswer);
        postAnswer.save().then(resp => res.json(resp)).catch(err=>res.json(err));
    }).catch(err=>{res.json(err)})
    
});


// Answering Questions API and Recording Response api
// For frontend users responding request
router.post('/patientanswer',userloginrequire,(req,res)=>{
    const _id = req.body.id;

    PatientQuestion.findOne({_id}).then(postAnswer=>{
        const userAnswer = {
            user:req.user.id,
           
            answer:req.body.answer,
        };
        postAnswer.response.unshift(userAnswer);
        postAnswer.save().then(resp => res.json(resp)).catch(err=>res.json(err));
    }).catch(err=>{res.json(err)})
    
});


// Answering Questions API and Recording Response api
// For frontend users responding request
router.post('/donoranswer',userloginrequire,(req,res)=>{
    const _id = req.body.id;
    DonorQuestion.findOne({_id}).then(postAnswer=>{
        const userAnswer = {
            user:req.user.id,
           
            answer:req.body.answer,
        };
        postAnswer.response.unshift(userAnswer);
        postAnswer.save().then(resp => res.json(resp)).catch(err=>res.json(err));
    }).catch(err=>{res.json(err)})
    
});




module.exports = router;

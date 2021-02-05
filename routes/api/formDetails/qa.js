const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../../config/keys');


// Middleware
const userloginrequire = require('../../../middleware/userRequireLogin');

// Models
const Questions = require('../../../models/formDetails/Questions');
const Answer = require('../../../models/formDetails/Answers');
const User = require('../../../models/User');
// const { use } = require('passport');

// POST REQUEST ADDING QUESTIONS VIA ADMIN PANEL
router.post('/addQuestions',(req,res)=>{

    Questions.findOne({ question : req.body.question }).then(qs=>{
        if(qs){
            return res.status(400).json({question:'Question Exists'});
        }else{
            const newQS = new Questions({
                question : req.body.question,
                options : req.body.options,
                type:req.body.type,
            });
            newQS.save().then(qs => res.json(qs));

        }
    }).catch(err => console.log(err));
 
});
// Fetching questions for the admin side.
router.get('/adminquestionLists', (req, res) => {
    Questions.find()
      .then(ques => res.json(ques))
      .catch(err => res.status(404).json({ noquesfound: 'No questions found' }));
  });

// Fetching responses from the users and showing it to admin panel
router.get('/admin/QA/response', (req, res) => {
    Answer.find()
      .then(ans => res.json(ans))
      .catch(err => res.status(404).json({ noansfound: 'No ans found' }));
});

// Fetching single response from the users and showing it to admin panel
router.get('/admin/QA/Singleresponse/:id', (req, res) => {
    Answer.findById({id:req.params.id})
      .then(ans => res.json(ans))
      .catch(err => res.status(404).json({ noansfound: 'No ans found' }));
});

// for frontend users
// GET REQUEST OF Questions
router.get('/questionLists', (req, res) => {
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

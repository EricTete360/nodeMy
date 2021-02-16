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

const NewQues = require('../../../models/formDetails/NewQues');

// For Admin Add Questions
router.post('/admin/addQues',(req,res)=>{
    NewQues.find()
           .then( ques => {
               if(ques){
                   return res.status(400).json({msg:"Question Exists"})
               }
               else{
                const addQues = {
                    question : req.body.question,
                    options : req.body.options,
                    type:req.body.type,
                    validation:req.body.validation,
                }
                ques.addInfo.unshift(addQues);
                // Save
                ques.save().then(qs => res.json(qs));
            }
               
           })
           .catch(err => res.status(404).json({ msg:err }))
})

router.post('/admin/patientQues',(req,res)=>{
    NewQues.find()
           .then( ques => {
               if(ques){
                   return res.status(400).json({msg:"Question Exists"})
               }
               else{
                const addQues = {
                    question : req.body.question,
                    options : req.body.options,
                    type:req.body.type,
                    validation:req.body.validation,
                }
                ques.patientInfo.unshift(addQues);
                // Save
                ques.save().then(qs => res.json(qs));
            }
               
           })
           .catch(err => res.status(404).json({ msg:err }))
})

router.post('/admin/donQues',(req,res)=>{
    NewQues.find()
           .then( ques => {
               if(ques){
                   return res.status(400).json({msg:"Question Exists"})
               }
               else{
                const addQues = {
                    question : req.body.question,
                    options : req.body.options,
                    type:req.body.type,
                    validation:req.body.validation,
                }
                ques.addInfo.unshift(addQues);
                // Save
                ques.save().then(qs => res.json(qs));
            }
               
           })
           .catch(err => res.status(404).json({ msg:err }))
})

// for frontend users
// GET REQUEST OF Questions
router.get('/questionLists',userloginrequire, (req, res) => {
    Questions.find()
      .then(ques => res.json(ques))
      .catch(err => res.status(404).json({ noquesfound: 'No questions found' }));
  });




router.post('/answer/:id',userloginrequire,(req,res)=>{
    Questions.findById(req.params.id).then(postAnswer=>{
        const userAnswer = {
            user:req.user.id,
            questionID:req.params.id,
            answer:req.body.answer,
        };
        postAnswer.response.unshift(userAnswer);
        postAnswer.save().then(resp => res.json(resp)).catch(err=>res.json(err));
    }).catch(err=>{res.json(err)})
 
});





module.exports = router;

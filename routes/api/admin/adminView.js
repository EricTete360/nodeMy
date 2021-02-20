const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../../config/keys');
const nodemailer = require('nodemailer');
const adpassport = require('passport');

// Inout Validation
const validateRegisterInput = require('../../../validation/register');

// Middleware
const adminloginrequire = require('../../../middleware/adminRequireLogin');

const User = require('../../../models/User');
// Models
const Questions = require('../../../models/formDetails/Questions');
const PatientQuestions = require('../../../models/formDetails/PatientQues');
const DonorQuestions = require('../../../models/formDetails/DonorQues');
const AnswerAddInfo = require('../../../models/formDetails/AnswersOFaddinfo');
const AnswerPatientDet  = require('../../../models/formDetails/AnswersOFPatientdet');
const AnswersDonordet = require('../../../models/formDetails/AnswersOFDonordet');

const { user } = require('../../../config/keys');
const AnswersOFaddinfo = require('../../../models/formDetails/AnswersOFaddinfo');
const AnswersOFPatientdet = require('../../../models/formDetails/AnswersOFPatientdet');
const AnswersOFDonordet = require('../../../models/formDetails/AnswersOFDonordet');

// const { use } = require('passport');

const transporter = nodemailer.createTransport({
    host: "smtp.googlemail.com",
    port:465,
    secure: true,
    auth: {
      user: keys.user,
      pass: keys.pass
    }
  });

router.get('/userDetails', (req, res) => {
    User.find()
      .then(user => res.json(user))
      .catch(err => res.status(404).json({ nouserfound: 'No user found' }));
});


// Info with Question and answers
router.get('/userInfo/:id', (req, res) => {
    const id = req.params.id;
    User.findById(id)
      .then(
          user => {
                res.json(user)
               
                    
            }
        )
      .catch(err => res.status(404).json({ nouserfound: 'No user found with this id' }));
});

router.get('/userResponse',(req,res)=>{
    Questions.find().select("question response")
             .then(rques => { 
                // rques.forEach(el =>{
                //     // console.log(el.question)
                //     // el.question
                //     res.json(el.question);
                // });
                // var val = parseJSON(rques);
                res.json(rques);
            })
             .catch(err=>{res.json(err)});

}); 

router.get('/userPatientResponse',(req,res)=>{
    PatientQuestions.find().select("question response")
             .then(rques => { 
                // rques.forEach(el =>{
                //     // console.log(el.question)
                //     // el.question
                //     res.json(el.question);
                // });
                // var val = parseJSON(rques);
                res.json(rques);
            })
             .catch(err=>{res.json(err)});

});

router.get('/userDonorResponse',(req,res)=>{
    DonorQuestions.find().select("question response")
             .then(rques => { 
                // rques.forEach(el =>{
                //     // console.log(el.question)
                //     // el.question
                //     res.json(el.question);
                // });
                // var val = parseJSON(rques);
                res.json(rques);
            })
             .catch(err=>{res.json(err)});

});
// name:Maqsood Sharma
// ID:60210d815a10d70004e1091e
// email:mqsd1995@gmail.com
// mobile:7771870921
// password:qwerty1995
// password2:qwerty1995

// Add User 
router.post('/addUser',(req,res)=>{
    const {errors, isValid} = validateRegisterInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email })
    .then( user => {
        if(user) {
            return res.status(400).json({email:'Email Already Exists'});
        }else {
            const newUser = new User({
                name:req.body.name,
                email:req.body.email,
                mobile:req.body.mobile,
                password:req.body.password,
            });
            bcrypt.genSalt(10,(err,salt)=>{
                bcrypt.hash(newUser.password,salt,(err,hash)=>{
                    if(err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user=>{
                            var URL ='https://jivandeep.herokuapp.com/';
                            var token = new Token({ user: user._id, token: crypto.randomBytes(16).toString('hex') });
                            token.save(function(err){
                              if(err){
                                return res.status(500).send({msg:err.message});
                              }
                              else{
                                  transporter.sendMail({
                                  to:user.email,
                                  from:"contact@jivandeep.org",
                                  subject:"Signup Success",
                                  html:`<h1>Welcome To Jivandeep</h1><br>
                                  <p> This is verification email please Do not reply to this mail</p><br>
                                  <p> <a href="${URL}/api/users/confirmation/${user.email}/${token.token}">click here to verify email</a></p>`
                              })
                              res.json(user)
                                var mailOptions = { from: "contact@jivandeep.org", to: user.email, subject: 'Account Verification Link', text: 'Hello '+ req.body.name +',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + user.email + '\/' + token.token + '\n\nThank You!\n' };
                                transporter.sendMail(mailOptions,function(err){
                                  if(!err){
                                     return res.status(200).send('A verification email has been sent to ' + user.email + '. It will be expire after one day. If you not get verification Email click on resend token.');
                                  }
                                  return res.status(500).send({msg:'Technical Issue!, Please click on resend for verify your Email.'});
                                })
                            }
                            });
                            })
                        .catch(err => console.log(err));
                })
            })
        }
    })
});



router.delete('/userdelete/:id', (req, res) => {
    const id = req.params.id;
    User.findByIdAndRemove(id)
      .then(user => res.json(user))
      .catch(err => res.status(404).json({ nouserfound: 'No user found with this id' }));
});


router.put('/userupdate/:id',(req,res)=>{
    const id = req.params.id;
    if(!req.body) {
        return res.status(400).send({
            message: "Please fill all required field"
        });
    }

    // Find user and update it with the request body
    User.findByIdAndUpdate(id, {
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile
    }, {new: true})
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "user not found with id " + req.params.id
            });
        }
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "user not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error updating user with id " + req.params.id
        });
    });
}); 


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
                validation:req.body.validation,
           });
        //    newQS.options.push(req.body.options);
            newQS.save().then(qs => res.status(200).json(qs)).catch(err => res.status(500).json(err));
        }
    }).catch(err => console.log(err));
 
});

router.post('/addPatientQuestions',(req,res)=>{

    PatientQuestions.findOne({ question : req.body.question }).then(pqs=>{
        if(pqs){
            return res.status(400).json({question:'Question Exists'});
        }else{
            const newPQS = new PatientQuestions({
                question : req.body.question,
                options : req.body.options,
                type:req.body.type,
                validation:req.body.validation,
           });
        //    newQS.options.push(req.body.options);
            newPQS.save().then(pqs => res.status(200).json(pqs)).catch(err => res.status(500).json(err));
        }
    }).catch(err => console.log(err));
 
});

router.post('/addDonorQuestions',(req,res)=>{

    DonorQuestions.findOne({ question : req.body.question }).then(dqs=>{
        if(dqs){
            return res.status(400).json({question:'Question Exists'});
        }else{
            const newDQS = new DonorQuestions({
                question : req.body.question,
                options : req.body.options,
                type:req.body.type,
                validation:req.body.validation,
           });
        //    newQS.options.push(req.body.options);
            newDQS.save().then(dqs => res.status(200).json(dqs)).catch(err => res.status(500).json(err));
        }
    }).catch(err => console.log(err));
 
});
// Fetching questions for the admin side.
router.get('/adminquestionLists', (req, res) => {
    Questions.find()
      .then(ques => res.json(ques))
      .catch(err => res.status(404).json({ noquesfound: 'No questions found' }));
  });

  // Fetching questions for the admin side.
router.get('/adminpatquestionLists', (req, res) => {
    PatientQuestions.find()
      .then(pques => res.json(pques))
      .catch(err => res.status(404).json({ noquesfound: 'No patients questions found' }));
  });

  // Fetching questions for the admin side.
router.get('/admindonquestionLists', (req, res) => {
    DonorQuestions.find()
      .then(dques => res.json(dques))
      .catch(err => res.status(404).json({ noquesfound: 'No Donor questions found' }));
  });

router.put('/questionupdate/:id',(req,res)=>{
    const id = req.params.id;
    if(!req.body) {
        return res.status(400).send({
            message: "Please fill all required field"
        });
    }

    // Find question and update it with the request body
    Questions.findByIdAndUpdate(id, {
        question : req.body.question,
        options : req.body.options,
        type:req.body.type,
        validation:req.body.validation,
    }, {new: true})
    .then(ques => {
        if(!ques) {
            return res.status(404).send({
                message: "Question not found with id " + req.params.id
            });
        }
        res.send(ques);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Question not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error updating question with id " + req.params.id
        });
    });
}); 

router.put('/patientquestionupdate/:id',(req,res)=>{
    const id = req.params.id;
    if(!req.body) {
        return res.status(400).send({
            message: "Please fill all required field"
        });
    }

    // Find question and update it with the request body
    PatientQuestions.findByIdAndUpdate(id, {
        question : req.body.question,
        options : req.body.options,
        type:req.body.type,
        validation:req.body.validation,
    }, {new: true})
    .then(paques => {
        if(!paques) {
            return res.status(404).send({
                message: "Question not found with id " + req.params.id
            });
        }
        res.send(paques);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Question not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error updating question with id " + req.params.id
        });
    });
}); 


router.put('/donorquestionupdate/:id',(req,res)=>{
    const id = req.params.id;
    if(!req.body) {
        return res.status(400).send({
            message: "Please fill all required field"
        });
    }

    // Find question and update it with the request body
    DonorQuestions.findByIdAndUpdate(id, {
        question : req.body.question,
        options : req.body.options,
        type:req.body.type,
        validation:req.body.validation,
    }, {new: true})
    .then(doques => {
        if(!doques) {
            return res.status(404).send({
                message: "Question not found with id " + req.params.id
            });
        }
        res.send(ques);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Question not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error updating question with id " + req.params.id
        });
    });
}); 


router.delete('/questiondelete/:id', (req, res) => {
    const id = req.params.id;
    Questions.findByIdAndRemove(id)
      .then(ques => res.json(ques))
      .catch(err => res.status(404).json({ noquesfound: 'No question found with this id' }));
});

router.delete('/patientquestiondelete/:id', (req, res) => {
    const id = req.params.id;
    PatientQuestions.findByIdAndRemove(id)
      .then(pques => res.json(pques))
      .catch(err => res.status(404).json({ nopquesfound: 'No patient question found with this id' }));
});

router.delete('/donorquestiondelete/:id', (req, res) => {
    const id = req.params.id;
    DonorQuestions.findByIdAndRemove(id)
      .then(dques => res.json(dques))
      .catch(err => res.status(404).json({ noquesfound: 'No donor question found with this id' }));
});


// // Fetching responses from the users and showing it to admin panel stats
router.get('/answerAddInfo', (req, res) => {
    AnswersOFaddinfo.find().populate("user qid")
      .then(ans => res.json(ans))
      .catch(err => res.status(404).json({ noansfound: 'No ans found' }));
});

router.get('/answerPatientInfo', (req, res) => {
    AnswersOFPatientdet.find().populate("user qid")
      .then(ans => res.json(ans))
      .catch(err => res.status(404).json({ noansfound: 'No ans found' }));
});

router.get('/answerDonorInfo', (req, res) => {
    AnswersOFDonordet.find().populate("user qid")
      .then(ans => res.json(ans))
      .catch(err => res.status(404).json({ noansfound: 'No ans found' }));
});

// // Fetching single response from the users and showing it to admin panel stats
// router.get('/admin/QA/Singleresponse/:id', (req, res) => {
//     Answer.findById({id:req.params.id})
//       .then(ans => res.json(ans))
//       .catch(err => res.status(404).json({ noansfound: 'No ans found' }));
// });


  
  
module.exports = router;


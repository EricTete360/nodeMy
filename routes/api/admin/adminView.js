const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../../config/keys');
const adpassport = require('passport');

// Inout Validation
const validateRegisterInput = require('../../../validation/register');
const validateLoginInput = require('../../../validation/login');

const User = require('../../../models/User');

router.get('/userDetails', (req, res) => {
    User.find()
      .then(user => res.json(user))
      .catch(err => res.status(404).json({ nouserfound: 'No user found' }));
});

router.get('/userInfo/:id', (req, res) => {
    const id = req.params.id;
    User.findById(id)
      .then(user => res.json(user))
      .catch(err => res.status(404).json({ nouserfound: 'No user found with this id' }));
});

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


  
  
module.exports = router;


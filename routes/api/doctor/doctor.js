const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../../config/keys');
const nodemailer = require('nodemailer');
const docauth = require('../../../middleware/docRequireLogin')
// In-out Validation
const validateRegisterInput = require('../../../validation/register');
const validateLoginInput = require('../../../validation/login');
// Models
const DoctorLogin = require('../../../models/doctor/Doctor');


const transporter = nodemailer.createTransport({
  host: "smtp.googlemail.com",
  port:465,
  secure: true,
  auth: {
    user: keys.user,
    pass: keys.pass
  }
});
// User Registration
router.post('/register',(req,res)=>{
    const {errors, isValid} = validateRegisterInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    DoctorLogin.findOne({ email: req.body.email })
    .then( user => {
        if(user) {
            return res.status(400).json({email:'Email Already Exists'});
        }else {
            
            const newUser = new DoctorLogin({
                name:req.body.name,
                email:req.body.email,
                mobile:req.body.mobile,
                password:req.body.password,

            });

            bcrypt.genSalt(10,(err,salt)=>{
                bcrypt.hash(newUser.password,salt,(err,hash)=>{
                    if(err) throw err;
                    newUser.password = hash;
                    newUser.save().then(user=>{res.json(user)})
                        
                })
            })
        }
    })
});


router.post('/login', (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);
  
    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
  
    const email = req.body.email;
    const password = req.body.password;
  
    // Find user by email
    DoctorLogin.findOne({ email }).then(user => {
      // Check for user
      if (!user) {
        errors.email = 'User not found';
        return res.status(404).json(errors);
      }
  
      // Check Password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          // User Matched
          const payload = { id: user.id, name: user.name,email:user.email,mobile:user.mobile }; // Create JWT Payload
  
          // Sign Token
          jwt.sign(
            payload,
            keys.docsecretOrKey,
            
            (err, token) => {
              res.json({
                success: true,
                username:user.name,
                token: 'Bearer ' + token
              });
            }
          );
        } else {
          errors.password = 'Password incorrect';
          return res.status(400).json(errors);
        }
      });
    });
  });

router.post('/reset-password',(req,res)=>{
  crypto.randomBytes(32,(err,buffer)=>{
      if(err){
          console.log(err);
      }
      const token = buffer.toString("hex")
      DoctorLogin.findOne({email:req.body.email})
          .then(user =>{
              if(!user){
                  return res.status(422).json({error:"User Doesn't exists of that email id"})
              }
              user.resetToken = token
              user.expireToken = Date.now() + 3600000
              user.save().then((result)=>{
                  transporter.sendMail({
                      to:user.email,
                      from:"contact@jivandeep.org",
                      subject:"Password Reset",
                      html:`
                      <h3>Your Request For Password Change</h3><br>
                      <h5>Click this <a href="http://localhost:3000/${token}">Click</a> to reset email</h5>
                      `

                  })
                  res.json({message:"Check Your Mail"})
              })
          })
  })
});

// New Password
router.post('/new-password',(req,res)=>{
    const newPassword = req.body.password;
    const sentToken = req.body.token;
    DoctorLogin.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
        .then(user=>{
            if(!user){
                return res.status(422).json({error:"Try Again Timeout"})
            }
            bcrypt.hash(newPassword,12).then(hashedpassword=>{
                user.password = hashedpassword
                user.resetToken = undefined
                user.expireToken = undefined
                user.save().then((saveduser)=>{
                    res.json({message:"Password Changed Successfully"})
                })
            })
        }).catch(err=>{
            console.log(err);
        })
});

router.get(
  '/',
  docauth,
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      mobile: req.user.mobile,
    });
  }
);
  



  
module.exports = router;


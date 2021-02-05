const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
const mailgun = require("mailgun-js");
const DOMAIN = 'sandbox964a0662091e48169e35b39d3c7af90c.mailgun.org';
const mg = mailgun({apiKey:'0b5bb9da41f45aea794e49829acba099-915161b7-a597293f',domain:DOMAIN}); 

// Mail System
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

// Inout Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');


// Models
const User = require('../../models/User');
const Token = require('../../models/Token');

// Email Setup
// const transporter = nodemailer.createTransport(sendgridTransport({
//     auth:{
//         api_key:"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",
//     }
// }));

// const transporter = nodemailer.createTransport({
//   host: "smtp.mailtrap.io",
//   port: 2525,
//   auth: {
//     user: "6f5fbe637eb509",
//     pass: "bd2f48721b4333"
//   }
// zoho password 8NXQbsiUhPLz
// });

// const transporter = nodemailer.createTransport({
//   service:'Zoho',
//   host: "smtp.zoho.com",
//   port:587,
//   secure: false,
//   ignoreTLS:true,
//   requireTLS:false,
//   auth: {
//     user: "contact@jivandeep.org",
//     pass: "8NXQbsiUhPLz"
//   }
// });

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
                                  subject:"Email Verification Jivandeep Health Tech",
                                  // text: 'Hello '+ req.body.name +',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/api\/users\/confirmation\/' + user.email + '\/' + token.token + '\n\nThank You!\n',
                                  html:`
                                  <style>
                                    
                                  </style>
                                  <div class="container">
                                  <h1>Welcome To Jivandeep</h1><br>
                                  <p> This is verification email please Do not reply to this mail</p><br>
                                  <p> <a href="${URL}/api/users/confirmation/${user.email}/${token.token}">click here to verify email</a></p>
                                  <div>
                                  `
                              })
                              res.json(user)
                          
                              }
                            });
                          })
                        .catch(err => console.log(err));
                })
            })
        }
    })
});

router.get('/confirmation/:email/:token',(req,res)=>{
  Token.findOne({token:req.params.token},function(err,token){
      if(!token){
        return res.status(400).send({
          msg:'Your Verification link may have expired.Please Click Resend to verify email'
        });
      }
      else{
        User.findOne({email:req.params.email},function(err,user){
          if(!user){
            return res.status(401).send({msg:'We were unable to find a user for this verification. Please SignUp!'});

          }
          else if (user.isVerified){
            return res.status(200).send('User has been already verified. Please Login');

          }

          else{
            user.isVerified = true;
            user.save(function(err){
              if(err){
                return res.status(500).send({msg:err.message});
              }
              else{
                
                return res.status(200).send('Your account has been successfully verified');

              }
            })
          }


        })
      }

  });

    
});

router.post('/resend-link',(req,res)=>{
  
    User.findOne({email:req.body.email},function(err,user){
      if (!user){
        return res.status(400).send({msg:'We were unable to find a user with that email. Make sure your Email is correct!'});
    }

    else if (user.isVerified){
      return res.status(200).send('This account has been already verified. Please log in.');

  } 

  else{
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
          subject:"Email Verification Jivandeep Health Tech",
          // text: 'Hello '+ req.body.name +',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/api\/users\/confirmation\/' + user.email + '\/' + token.token + '\n\nThank You!\n',
          html:`<h1>Welcome To Jivandeep</h1><br>
          <p> This is verification email please Do not reply to this mail</p><br>
          <p> <a href="${URL}/api/users/confirmation/${user.email}/${token.token}">click here to verify email</a></p>`
      })
      res.json(user)
      
      }

    });


   
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
    User.findOne({ email }).then(user => {
      // Check for user
      if (!user) {
        errors.email = 'User not found';
        return res.status(404).json(errors);
      }
  
      // Check Password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          // User Matched
          const payload = { id: user.id, name: user.name,email:user.email }; // Create JWT Payload
  
          // Sign Token
          jwt.sign(
            payload,
            keys.secretOrKey,
            
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
  


// Reset Password
router.post('/reset-password',(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err);
        }
        const token = buffer.toString("hex")
        User.findOne({email:req.body.email})
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
    User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
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
    '/current',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
      });
    }
  );
  

  
module.exports = router;


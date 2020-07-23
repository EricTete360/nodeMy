const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// Mail System
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

// Inout Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

const User = require('../../models/User');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:"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",
    }
}));


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
                password:req.body.password,

            });

            bcrypt.genSalt(10,(err,salt)=>{
                bcrypt.hash(newUser.password,salt,(err,hash)=>{
                    if(err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user=>{
                            transporter.sendMail({
                                to:user.email,
                                from:"contact@jivandeep.org",
                                subject:"Signup Success",
                                html:"<h1>Welcome To Jivandeep</h1><br><p>Do not reply to this mail</p>"
                            })
                            res.json(user)
                        })
                        .catch(err => console.log(err));
                })
            })
        }
    })
});

router.post('/login',(req,res)=>{

    const {errors, isValid} = validateLoginInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email}).then(user => {
        if(!user) {
            return res.status(404).json({email:'User Not Found'});
        }
        bcrypt.compare(password,user.password).then(isMatch=>{
            if(isMatch){
                const payload = { _id:user.id, name: user.name }; // Create JWT Payload

                // Sign Token
                jwt.sign(
                  payload,
                  keys.secretOrKey,
                  { expiresIn: 3600*48 },
                  (err, token) => {
                    res.json({
                      success: true,
                      token: 'Bearer ' + token
                    });
                  }
                );
            
            
            } else {
                return res.status(400).json({ password:'Password Incorrect' });
            }
        })
    })
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
                        from:"no-reply@jivandeep.org",
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


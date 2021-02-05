const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const fast2sms = require('fast-two-sms')


// Models
const User = require('../../models/User');
const OTP = require('../../models/Otp');

// Mobile OTP
const validateMobOTP = require('../../validation/mobOTP');
const validateOTP = require('../../validation/validateOTP');

router.post('/otp/login',(req,res)=>{
    const { errors, isValid } = validateMobOTP(req.body);
  
    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    // User's Input Mobile Number and sms gateway setup
    const mobile = req.body.mobile;
    User.findOne({mobile}).then(user=>{
        if(!user){
            return res.status(404).send({msg:"Mobile Number not registered"});        
        }
        else {
            var digits = '0123456789';
            let otp = '';
            for (let i=0; i<4;i++) {
                otp+= digits[Math.floor(Math.random()*10)];
            }
            const mobOTP = new OTP({
                user: user._id,
                otp: otp,
            });
            mobOTP.save().then(
                qs=>
                {
                    console.log(otp);
                    var options = {
                        authorization:keys.fast2sms,
                        message:'Your OTP is'+otp,
                        numbers:[req.body.mobile]
                    }
                    fast2sms.sendMessage(options);
                    res.status(200).send({msg:qs});
                }
                );
        }
    });
    
});
  
router.post('/otp/verify/:mobile',(req,res)=>{
    const { errors, isValid } = validateOTP(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const otp = req.body.otp;
    OTP.findOne({otp}).then(motp=>{
        if(!motp){
            return res.status(404).send({msg:"OTP invalid"});        
        }else{
            if(motp.otp===otp){
                User.findOne({mobile:req.params.mobile}).then(user=>
                {
                    const payload = { id: user.id, name: user.name,email:user.email,mobile:user.mobile }; // Create JWT Payload
  
                    // Sign Token
                    jwt.sign(
                        payload,
                        keys.secretOrKey,
                    
                        (err, token) => {
                        res.json({
                            success: true,
                            message: 'OTP Correct',
                            username:user.name,
                            mobile:user.mobile,
                            token: 'Bearer ' + token
                        });
                        }
                    );
                });

                OTP.deleteMany({otp:motp.otp}).then(success=>{
                    return res.status(200).send({msg:'OTP used'});
                });
                
            }            
            else{
                return res.status(404).send({msg:"OTP invalid"});
            }
        }
    });
        
});

  
module.exports = router;


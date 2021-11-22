const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../../config/keys');
const Razorpay = require('razorpay');

// Middleware
const userloginrequire = require('../../../middleware/userRequireLogin');
let razorpayInstance = new Razorpay({
  key_id:"rzp_test_Y4OyaGN23UAlCU",
  key_secret:"kUXicIEIk5MHgvvetM15Vxto",
});


const DoctorBasic = require('../../../models/doctor/DoctorBasic');
const Booking = require('../../../models/Appointment/Booking');
const PaymentDetail = require('../../../models/Appointment/PaymentDetail');
const { nanoid } = require('nanoid');
const { json } = require('body-parser');


// for frontend users
// GET REQUEST OF Questions
router.get('/doctorslist',userloginrequire, (req, res) => {
    DoctorBasic.find().populate("user")
      .then(docs => res.status(200).json(docs))
      .catch(err => res.status(404).json({ nodocfound: {msg:'No doctors found',reason:err} }));
});
// 
router.get('/doctor/:id',userloginrequire, (req, res) => {
  DoctorBasic.findOne({_id:req.params.id}).populate("user")
    .then(docs => res.status(200).json(docs))
    .catch(err => res.status(404).json({ nodocfound: {msg:'No doctor found',reason:err} }));
});

router.get('/bookinglist',userloginrequire,(req,res)=>{
  Booking.findOne({user:req.user.id})
         .then(list => { 
          if(!list){
            return res.status(404).json({ msg:"No Booking Found" });

           }
           res.json(list);
          })
         .catch(err => { res.status(401).json(err); });
});

router.post('/bookappointment',userloginrequire,(req,res)=>{
  const {doc_id,doc_name,patient_name,time_slot,phone,booking_date,hospital_address} = req.body ;

  if (!doc_id||!doc_name||!patient_name||!time_slot||!phone||!booking_date || !hospital_address) {
    return res.status(422).json({ error:"Please Add All Details" });
  }

  const newBooking = new Booking({
    user : req.user.id,
    doc_id : req.body.doc_id,
    doc_name : req.body.doc_name,
    patient_name : req.body.patient_name,
    time_slot : req.body.time_slot,
    phone : req.body.phone,
    hospital_address : req.body.hospital_address,
    booking_date : req.body.booking_date,
  });
  newBooking.save()
            .then(book=>{res.status(200).json(book);})
            .catch(err=>{ res.status(403).json(err);});

});


// Booking payment
// Reference Link: https://github.com/TheStarkster/Razorpay-Node-React-Sample-Kit
router.post('/payment-trigger',userloginrequire,async (req,res)=>{

  params = {
    amount: req.body.amount ,
    currency: "INR",
    receipt: nanoid(),
    payment_capture: "1"
  };

  try {
    const response = await razorpayInstance.orders.create(params);
    console.log(response);
    const paydetail = new PaymentDetail({
                    user : req.user.id,
                    orderId: response.id,
                    receiptId: response.receipt,
                    amount: response.amount,
                    currency: response.currency,
                    createdAt: response.created_at,
                    status: response.status
                  });
                  paydetail.save().then((obj)=>{
                    res.status(200).json({
                      obj
                    });
                  })
   
  } catch (error) {
    console.log(error);
  }

});


router.post('/verify',userloginrequire,async function(req,res){

  body=req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
	let crypto = require("crypto");
	let expectedSignature = crypto.createHmac('sha256','kUXicIEIk5MHgvvetM15Vxto')
							.update(body.toString())
							.digest('hex');

	// Compare the signatures
	if(expectedSignature === req.body.razorpay_signature) {
		// if same, then find the previosuly stored record using orderId,
		// and update paymentId and signature, and set status to paid.
		await PaymentDetail.findOneAndUpdate(
			{ orderId: req.body.razorpay_order_id },
			{
				paymentId: req.body.razorpay_payment_id,
				signature: req.body.razorpay_signature,
				status: "paid"
			},
			{ new: true },
			function(err, doc) {
				// Throw er if failed to save
				if(err){
					throw err;
				}
        res.status(200).json({'msg':"Payment Verification Successful"});
			}
		);
	} else {
    res.status(400).json({'msg':"Payment Verification Failed"});

	}
});


module.exports = router;


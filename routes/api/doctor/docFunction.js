const express = require('express');
const router = express.Router();
const docauth = require('../../../middleware/docRequireLogin')

// Models
const DoctorAppointment = require('../../../models/doctor/DoctorAppointment');
const DoctorTimeLeave = require('../../../models/doctor/DoctorSlot');
const DoctorPatientIntake = require('../../../models/doctor/PatientIntake');

// Doctor Active Inactive Setting Function
// Method:GET
router.get('/isActive',docauth,(req,res)=>{
    DoctorAppointment.findOne({ user:req.params.id })
                     .then(docAppoint=>{
                         if(!docAppoint){
                            return res.status(200).json({status:false})
                         }
                         else{
                            return res.status(200).json(docAppoint)
                         }
                     })
                     .catch(error => { res.status(400).json(error) })
})

// Method:POST
router.post('/setActive',docauth,(req,res)=>{
    const newActive = new DoctorAppointment({
        user: req.user.id,
        isActive: req.body.isActive,
    })
    newActive.save()
             .then(act => { res.status(200).json(act) }) 
             .catch(err => { res.status(400).json(err) }) 
});

// Method:PUT
router.put('/updateActive',docauth,(req,res)=>{

    const upfields = {}


   DoctorAppointment.findOne({user:req.user.id})
                    .then(upobj=>{ 
                        if(upobj){
                            DoctorAppointment.updateOne({user:req.user.id},{isActive:req.body.isActive},{new:true})
                                              .then(upact=>{res.status(200).json(upact)})
                                              .catch(err=>{res.status(400).json(err)})
                        }
                     })
     
})

// Doctor Availability setting function
// Method:GET
router.get('/timeleave',docauth,(req,res)=>{
    DoctorTimeLeave.findOne({ user:req.params.id })
                     .then(docLeave=>{
                         if(!docLeave){
                            return res.status(400).json({msg:"Leave Unavailable"})
                         }
                         else{
                            return res.status(200).json(docLeave)
                         }
                     })
                     .catch(error => { res.status(400).json(error) })
})

// Method:POST
router.post('/setTimeLeave',docauth,(req,res)=>{
    const newTimeLeave = new DoctorTimeLeave({
        user: req.params.id,
        leave_date: req.body.leave_date,
        due: req.body.due,
    })
    newTimeLeave.save()
             .then(stl => { res.status(200).json(stl) }) 
             .catch(err => { res.status(400).json(err) }) 
});

// Doctor's Patient Intake setting function
// Method:GET
router.get('/paientintake',docauth,(req,res)=>{
    DoctorPatientIntake.findOne({ user:req.params.id })
                     .then(docIntake=>{
                         if(!docIntake){
                            return res.status(400).json({msg:"Leave Unavailable"})
                         }
                         else{
                            return res.status(200).json(docIntake)
                         }
                     })
                     .catch(error => { res.status(400).json(error) })
});

// Method:POST
router.post('/setPatientIntake',docauth,(req,res)=>{
    const newPatientIntake = new DoctorPatientIntake({
        user: req.params.id,
        intake: req.body.intake,
        notes: req.body.notes,
    })
    newPatientIntake.save()
             .then(pit => { res.status(200).json(pit) }) 
             .catch(err => { res.status(400).json(err) }) 
});


// Doctors Booking List And Setting it's checkmark 
router.get('/bookinglist',docauth,(req,res)=>{
    
    Booking.findOne({doc_id:req.user.id})
            
           .then(list => { 
            console.log(req.user.id)
            if(!list){
              return res.status(404).json({ msg:"No Booking Found" });
  
             }
             res.json(list);
            })
           .catch(err => { res.status(401).json(err); });
  });
  

module.exports = router;

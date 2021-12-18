const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const EnquiryDocs = new mongoose.Schema({
   
    fullname:{
        type:String,
        required:true
    },
    email:{
        type:String,
    },
    city:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    service:{
        type:String,
        required:true
    },
    
});


module.exports = enquiryDocs = mongoose.model('enquirydocs', EnquiryDocs);
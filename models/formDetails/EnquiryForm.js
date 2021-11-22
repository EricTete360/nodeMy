const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const EnquiryDocs = new mongoose.Schema({
    user: {
        //   Db relationship as in foreignkey
        type: Schema.Types.ObjectId,
        ref: 'users',
        
    },
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
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
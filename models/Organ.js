const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const patient = new mongoose.Schema({
    user: {
        //   Db relationship as in foreignkey
        type: Schema.Types.ObjectId,
        ref: 'users',
        
    },
    idNumber:{
        type:String,
        required:true
    },
    idProofImage:{
        type:String,
        required:true
    },
    medDocument:{
        type:Array,
        required:true
    },

});


module.exports = Patient = mongoose.model('patients', patient);
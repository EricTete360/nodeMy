const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const answersPatientdet = new mongoose.Schema({
    // user: {
    //     //   Db relationship as in foreignkey
    //     type: Schema.Types.ObjectId,
    //     ref: 'users',
    // },
 
            user: {
                //   Db relationship as in foreignkey
                type: Schema.Types.ObjectId,
                ref: 'users',
            },
            qid: {
                //   Db relationship as in foreignkey
                type: Schema.Types.ObjectId,
                ref: 'patquestions',
            },
            
            answer:{
                type:String,
            },
 

});


module.exports = AnswerPatientDet = mongoose.model('answers_patientdet', answersPatientdet);
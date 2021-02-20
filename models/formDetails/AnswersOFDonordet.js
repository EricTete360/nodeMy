const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const answersOfDonor = new mongoose.Schema({
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
                ref: 'donquestions',
            },
            
            answer:{
                type:String,
            },
    

});


module.exports = AnswerDonorDet = mongoose.model('answers_donor', answersOfDonor);
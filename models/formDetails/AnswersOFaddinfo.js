const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const answersaddinfo = new mongoose.Schema({
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
                ref: 'questions',
            },
            
            answer:{
                type:String,
            },
 

});


module.exports = AnswerAddinfo = mongoose.model('answers_addInfo', answersaddinfo);
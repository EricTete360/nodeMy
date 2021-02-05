const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const answers = new mongoose.Schema({
    user: {
        //   Db relationship as in foreignkey
        type: Schema.Types.ObjectId,
        ref: 'users',
    },
    questionID: {
        //   Db relationship as in foreignkey
        type: Schema.Types.ObjectId,
        ref: 'questions',
    },
    
    answer:{
        type:String,
    },

});


module.exports = Answer = mongoose.model('answers', answers);
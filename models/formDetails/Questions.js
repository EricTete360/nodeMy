const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const question = new mongoose.Schema({

    question:{
        type:String,
        required:true
    },
   
    options:{
        type:Array,
        
    },

    type:{
        type: String,
        enum : [
            'text',
            'textarea',
            'checkbox',
            'file',
            'email',
            'image',
            'number',
            'radio',
            'range',
            'submit',
            'button',
            'date',
        ],
        default: 'text'
    },
    validation:{
        type: String,
        enum : [
            'true',
            'false',
        ],
        default: 'false'
    },
    date: {
        type: Date,
        default: Date.now
      }

});


module.exports = Question = mongoose.model('questions', question);
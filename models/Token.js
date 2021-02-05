const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const TokenSchema = new Schema({
    user: {
        //   Db relationship as in foreignkey
        type: Schema.Types.ObjectId,
        ref: 'users',
    },
    token: { 
        type: String,
        required: true 
    },
    expireAt: { 
        type: Date, 
        default: Date.now, 
        index: { expires: 86400000 } 
        // 86400000 ms = 24 HRS
    },
  
});

module.exports = Token = mongoose.model('tokens', TokenSchema);

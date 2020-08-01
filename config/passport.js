const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users');
const keys = require('../config/keys');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('Bearer');
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
    passport.use(
        new JwtStrategy(opts,(jwt_payload,done)=>{
         console.log(jwt_payload);   
        User.findById(jwt_payload).then(user => {
           
            if(user) {
                
                return done(null,user);
            }
            return done(null,false);
        }).catch(err=> console.log(err));
    }));



    passport.serializeUser(function(user, done) {
        done(null, user.id); 
       // where is this user.id going? Are we supposed to access this anywhere?
    });
    
    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
};

// 54342342h3
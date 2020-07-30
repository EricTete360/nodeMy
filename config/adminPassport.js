const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const adminUser = mongoose.model('adminusers');
const keys = require('../config/keys');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = adpassport => {
    adpassport.use(
        new JwtStrategy(opts,(jwt_payload,done)=>{
            adminUser.findById(jwt_payload).then(user => {
            if(user) {
                return done(null,user);
            }
            return done(null,false);
        }).catch(err=> console.log(err));
    }));
};
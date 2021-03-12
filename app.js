const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
const adpassport = require('passport');

const users = require('./routes/api/users');
const mobotp = require('./routes/api/mobileOTP');
const profiles = require('./routes/api/profile');
const patients = require('./routes/api/patient');
const donors = require('./routes/api/donor');
const admin = require('./routes/api/admin/users');
const adminView = require('./routes/api/admin/adminView');
const forms = require('./routes/api/formDetails/qa');
const doctor = require('./routes/api/doctor/doctor');
const doctorprofile = require('./routes/api/doctor/docProfile');

// Sendgrid api
// username apikey
// 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

const app = express();

// Body Parser Middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(function(req,res,next){
        res.header("Access-Control-Allow-Origin","*");
        res.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept,Authorization");
        res.header("Access-Control-Allow-Methods","GET,PUT,PATCH,POST,DELETE,OPTIONS");
        next();
});

app.use(morgan('dev'));


// DB Config
const db = require('./config/keys').mongoURI;

mongoose.connect(db, { useNewUrlParser: true ,useUnifiedTopology: true,autoIndex:true})
        .then(()=>console.log('MongoDB Connected'))
        .catch((err)=>console.log(err));

// Passport Middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);
// Admin Passport Config
require('./config/adminPassport')(adpassport);


// User Routes
app.use('/api/users',users);
app.use('/api/mobile',mobotp);
app.use('/api/profile',profiles);
app.use('/api/patient',patients);
app.use('/api/donor',donors);
// Adminpanel Side
app.use('/api/admin',admin);
app.use('/api/admin/view',adminView);
// Form Questions Api
app.use('/api/forms',forms);
// Doctor API
app.use('/api/doctor',doctor);
app.use('/api/doctor/details',doctorprofile);




const port = process.env.PORT || 5000;
app.listen(port,()=>console.log(`server running on port ${port}`));
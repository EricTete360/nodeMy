const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');

const users = require('./routes/api/users');
const profiles = require('./routes/api/profile');
const fileupload = require('express-fileupload');

// Sendgrid api
// username apikey
// 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

const app = express();

// Body Parser Middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.use(fileupload(
        {
                limits:{ fileSize: 2*1024*1024 }
        }
));
// DB Config
const db = require('./config/keys').mongoURI;

mongoose.connect(db, { useNewUrlParser: true ,useUnifiedTopology: true,autoIndex:true})
        .then(()=>console.log('MongoDB Connected'))
        .catch((err)=>console.log(err));

// Passport Middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

// Use Routes
app.use('/api/users',users);
app.use('/api/profile',profiles);


const port = process.env.PORT || 5000;
app.listen(port,()=>console.log(`server running on port ${port}`));
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../../config/keys');
const docauth = require('../../../middleware/docRequireLogin')
// In-out Validation
const validateRegisterInput = require('../../../validation/register');
const validateLoginInput = require('../../../validation/login');
// Models
const DoctorLogin = require('../../../models/doctor/Doctor');

// User Registration
router.get('/docdet', (req, res) => {
    DoctorLogin.find()
      .then(user => res.json(user))
      .catch(err => res.status(404).json({ nouserfound: 'No doctor found' }));
});

router.get(
'/',
docauth,
(req, res) => {
    res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    mobile: req.user.mobile,
    });
}
);
  

  
module.exports = router;


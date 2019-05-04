const express = require('express');
const users   = express.Router();
const User    = require('../models/users.js');
const bcrypt  = require('bcrypt');

users.get('/new', function(req, res) {
    console.log('Inside "new" route in users.js');
    res.render('users/new.ejs');
})

users.post('/', function(req, res) {
    console.log('Inside POST ("create user") route in users.js');
    // overwrite the user password with the hashed password,
    // then pass that in to our database
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    User.create(req.body, function(err, createdUser) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(createdUser);
            res.redirect('/');
        }
    });
});

module.exports = users;

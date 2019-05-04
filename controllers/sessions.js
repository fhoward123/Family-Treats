const express  = require('express');
const sessions = express.Router();
const User     = require('../models/users.js');
const bcrypt   = require('bcrypt');

sessions.get('/new', function(req, res) {
    console.log('Inside "new" route (login page) in sessions.js');
    res.render('sessions/new.ejs');
});

sessions.delete('/', function(req, res) {
    console.log('Inside DELETE route in sessions.js');
    req.session.destroy(function() {
        res.redirect('/')
    });
});

sessions.post('/', function(req, res) {
    console.log('Inside POST("login") route in sessions.js');
    User.findOne({ username: req.body.username }, function(err, foundUser) {
        console.log('req.body: ', req.body);
        console.log('Searching for: ', req.body.username);
        console.log('foundUser = ', foundUser);
        if (err) {
            console.log(`Login error: (${err.message})`);
        }
        else if ( foundUser ) {
            // returns true or false
            if ( bcrypt.compareSync (req.body.password, foundUser.password ) ) {
                req.session.currentUser = foundUser;
                res.redirect('/');
            }
            else {
                res.send('<a href="/">wrong password</a>')
            }
        }
        else {
            res.send('<a href="/">unknown username</a>')
        }
    });
});

module.exports = sessions;

// =======================================
//              DEPENDENCIES
// =======================================
//require express so we can use router
const express = require('express');
const recipes = express.Router();

// =======================================
//                 MODELS
// =======================================
//get access to the Recipe model
const Recipe  = require('../models/recipes.js');

// =======================================
//            7 RESTful ROUTES
// =======================================
// Index  : GET    '/recipes'          1/7
// Show   : GET    '/recipes/:id'      2/7
// New    : GET    '/recipes/new'      3/7
// Create : POST   '/recipes'          4/7
// Edit   : GET    '/recipes/:id/edit' 5/7
// Update : PUT    '/recipes/:id'      6/7
// Delete : DELETE '/recipes/:id'      7/7
// =======================================

// New    : GET    '/recipes/new'      3/7
// Order matters! must be above /recipes/:id or else this
// route will never get hit
recipes.get('/new', function(req, res) {
    console.log('Inside "new" route in recipes.js');
    if ( req.session.currentUser ) {
        console.log('current user: ', req.session.currentUser);
        res.render('app/recipes/new.ejs', { currentUser: req.session.currentUser });
    }
    else {
        console.log('Current user is NOT logged in... Redirecting to /sessions/new...')
        res.redirect('/sessions/new');
    }
})

// Create : POST   '/recipes'          4/7
recipes.post('/', function(req, res) {
    console.log('Inside POST ("recipe create") route in recipes.js');
    console.log('req.body: ', req.body);
    Recipe.create(req.body, function(err, createdRecipe) {
        if (err) {
            console.log(err);
        }
        console.log(`\nPosted recipe: \n\n${createdRecipe}`);
        res.redirect( '/recipes/' + createdRecipe.id );
        // res.render('app/index.ejs', {});
    });
});

// Use to find all recipes by specific tag
recipes.get ('/search/:tag', function(req, res) {
    console.log('Inside GET ("search by tag") route in recipes.js');
    if ( req.session.currentUser ) {
        Recipe.find({tag: req.params.tag}, function(err, recipes) {
            if (err) {
                console.log(`Something went wrong with data query!  (${err.message})`);
            }
            // else {
            //     console.log(`\nQuery result:\n\n ${recipes}`);
            // }
            res.render ( 'app/recipes/listAll.ejs', {
                recipes: recipes,
                owner: req.session.currentUser.username
            });
        });
    }
    else {
        res.redirect('/');
    }
});

// Show   : GET    '/recipes/:id'      2/7
recipes.get ('/:id', function(req, res) {
    console.log('Inside GET ("recipe show") route in recipes.js');
    if ( req.session.currentUser ) {
        Recipe.findById( req.params.id, function(err, foundRecipe) {
            if (err) { console.log ( 'Error retrieving recipe', err.message ); }
            console.log('Rendering recipe via app/recipes/show.ejs: ', foundRecipe);
            console.log('Recipe submitter: ', foundRecipe.username);
            console.log('Current login name: ', req.session.currentUser.username);
            res.render ( 'app/recipes/show.ejs', {
                recipe: foundRecipe,
                currentUser: req.session.currentUser.username
            });
        });
    }
    else {
        // res.redirect('/recipes/' + req.params.id);
        res.redirect('/');
    }
});

// Edit   : GET    '/recipes/:id/edit' 5/7
recipes.get ('/:id/edit', function(req, res) {
    console.log('Inside GET ("recipe edit") route in recipes.js');
    console.log('Looking for id: ', req.params.id);
    Recipe.findById( req.params.id, function(err, recipe) {
        if ( err ) { console.log (err); }
        if ( req.session.currentUser ) {
            console.log(`Comparing '${req.session.currentUser.username}' with '${recipe.username}'`)
            res.render ( 'app/recipes/edit.ejs', { recipe : recipe } );
        }
        else {
            res.redirect('/recipes/' + req.params.id);
        }
    });
});

// Update : PUT    '/recipes/:id'      6/7
recipes.put('/:id', function(req, res) {
    console.log('Inside PUT ("recipe update") route in recipes.js');
    console.log('Updating db with: ', req.body);
    console.log('Updating ID: ', req.params.id);
    Recipe.findByIdAndUpdate( req.params.id, req.body, { new : true }, function(err, updatedRecipe) {
        if ( err ) { console.log(err); }
        res.redirect ( '/recipes/' + updatedRecipe.id );
    });
});

// Delete : DELETE '/recipes/:id'      7/7
recipes.delete ('/:id', function(req, res) {
    console.log('Inside DELETE ("recipe delete") route in recipes.js');
    console.log('Deleting id: ', req.params.id);
    console.log('req.params: ', req.params);
    Recipe.findByIdAndRemove( req.params.id, function(err, recipe) {
        if ( err ) { console.log(err); }
        res.redirect ( '/' );
    });
});

module.exports = recipes;

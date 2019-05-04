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

// Index  : GET    '/recipes'          1/7
// recipes.get( '/', function(req, res) {
//     console.log('Inside GET "index" route in recipes.js');
//     Recipe.find( {}, function(err, recipes) {
//         console.log('recipes = ', recipes);
//         if (err) { console.log(err); }
//         res.render ( 'app/index.ejs', { recipes: recipes } );
//     });
// });

// New    : GET    '/recipes/new'      3/7
// Order matters! must be above /recipes/:id or else this
// route will never get hit
recipes.get('/new', function(req, res) {
    console.log('Inside "new" route in recipes.js');
    if ( req.session.currentUser ) {
        console.log('current user', req.session.currentUser);
        res.render('app/recipes/new.ejs',
            {
                currentUser: req.session.currentUser
            }
        );
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

// Show   : GET    '/recipes/:id'      2/7
recipes.get ('/:id', function(req, res) {
    console.log('Inside GET ("recipe show") route in recipes.js');
    Recipe.findById( req.params.id, function(err, foundRecipe) {
        if (err) { console.log ( 'Error retrieving recipe', err.message ); }
        console.log('Rendering recipe via app/recipes/show.ejs: ', foundRecipe);
        res.render ( 'app/recipes/show.ejs', { recipe: foundRecipe } );
    });
});

// Edit   : GET    '/recipes/:id/edit' 5/7
recipes.get ('/:id/edit', function(req, res) {
    console.log('Inside GET ("recipe edit") route in recipes.js');
    Recipe.findById( req.params.id, function(err, recipe) {
        if ( err ) { console.log (err); }
        res.render ( 'app/recipes/edit.ejs', { recipe : recipe } );
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
    Recipe.findByIdAndRemove( req.params.id, function(err, recipe) {
        if ( err ) { console.log(err); }
        // res.redirect ( '/recipes' );
        res.redirect ( '/' );
    });
});

module.exports = recipes;

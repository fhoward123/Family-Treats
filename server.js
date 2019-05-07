// =======================================
//              DEPENDENCIES
// =======================================
const express         = require('express');
const app             = express();
const methodOverride  = require('method-override');
const mongoose        = require('mongoose');
require('dotenv').config();
const morgan = require('morgan');

// =======================================
//                  PORT
// =======================================
// Allow use of Heroku's port or your local port, depending on the environment
const PORT = process.env.PORT || 3000;

// =======================================
//                DATABASE
// =======================================

// How to connect to the database either via heroku or locally.
// Tells mongoDB to create local db called "recipes"
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/' + 'the_kitchen';

// Connect to Mongod
mongoose.connect(MONGODB_URI, { useNewUrlParser: true }, function() {
	console.log(`mongo running at ${MONGODB_URI}`);
});

// Set the db connection to constant for easy access
const db = mongoose.connection;

// function will be called when the connection to mongodb
// is open (i.e. the connection is successful)
db.once('open', function() {
    console.log('db.once msg: connected to mongo');
});

// Use event handling to get more useful messages in console
db.on('error', (err) => console.log(`mongo not running: (${err.message})`));
db.on('connected', () => console.log(`mongo connected to ${MONGODB_URI}`));
db.on('disconnected', () => console.log('mongo disconnected'));
db.on('reconnected', () => console.log('mongo reconnected'));

process.on('SIGINT', function() {
    db.close(function() {
        console.log("Mongoose connection is closed due to application termination");
        process.exit(0);
    });
});

// =======================================
//              MIDDLEWARE
// =======================================

app.use(morgan('tiny'));
// Use public folder for static assets
app.use(express.static('public'));

// Use method override to allow POST, PUT and DELETE from a form
// by adding a query parameter (_method) to the delete form
app.use(methodOverride('_method'));

// Populates req.body with parsed info from forms
// (formerly known as "body-parser")
// - if no data from forms it will return an empty object {}
// The "extended: false" does not allow nested objects in query strings
app.use(express.urlencoded({ extended: false }));
// returns middleware that only parses JSON - may or may not need it depending on your project
app.use(express.json());

// Setup up secure session (Must come BEFORE controllers)
const session = require('express-session');
app.use(session({
    // "secret" is a random string to encrypt the data
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));
///////////////////////////////////////////////////
/////////////// End of Middleware /////////////////
///////////////////////////////////////////////////

// MUST come after app.use(session) **************************/
// =======================================
//              CONTROLLERS
// =======================================
//Step 1/3 require the controller to be able to use the products routes
const recipesController = require ( './controllers/recipes' );

//Step 2/3 app.use this controller and when `/products` is visted
//Note, step 3 is in controllers/products.js
app.use( '/recipes', recipesController );

const sessionsController = require('./controllers/sessions.js');
app.use('/sessions', sessionsController);

const usersController = require('./controllers/users.js');
app.use('/users', usersController);

// =======================================
//                 MODELS
// =======================================
// Get access to the Recipe model
const Recipe = require('./models/recipes.js');

// =======================================
//                 ROUTES
// =======================================

// Index  : GET    '/recipes'          1/7
app.get('/', function(req, res) {
    console.log('Inside INDEX route (/recipes) in server.js');
    res.render('index.ejs', {
        currentUser: req.session.currentUser
    });
});

app.get('/about', function (req, res) {
    res.send('About family trEATs');
})

// Seed Route - Visit ONCE to populate database
const recipeSeeds = require( './models/seed.js');
app.get('/seed/newrecipes', async function(req, res) {
// recipes.get('/seed/newrecipes/viaseedfile', function(req, res) {
    Recipe.insertMany(recipeSeeds, function(err, recipes) {
        if (err) { console.log(err); }
        else {
            res.send(recipes);
        }
    });
});

app.get('/app', function(req, res) {
    console.log('Inside "app" route in server.js');
    // Display special index for logged in users
    if ( req.session.currentUser ) {
        Recipe.find( {}, function(err, recipes) {
            // console.log('recipes = ', recipes);
            if (err) { console.log(err); }
            console.log('Rendering to app/index.ejs from server.js');
            res.render ( 'app/index.ejs', { recipes: recipes } );
        });
        // res.render('app/index.ejs');
    }
    else {
        console.log('Redirecting to /sessions/new from server.js');
        res.redirect('/sessions/new');
    }
});

app.get('/destroy-route', function() { //any route will work
    console.log('Inside DESTROY route in server.js');
	req.session.destroy( function(err) {
		if (err) {
			console.log("DOH!");
		}
        else {
			console.log("Successfully destroyed session");
		}
	});
});

// =======================================
//                LISTENER
// =======================================
app.listen(PORT, () => console.log(`Auth happening on port ${PORT}`));

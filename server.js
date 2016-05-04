var express 	= require ('express');
var mongoose 	= require('mongoose');
var cors 		= require('cors');
var bodyParser  = require('body-parser');
var jwt  		= require('jsonwebtoken');
var path		= require('path');
var morgan  	= require('morgan');
var config 		= require('./config');

// Enviroment varibales 
//------------------------------------------
var PORT 			= process.env.PORT 			|| 8080;
var DATABASE		= process.env.DATABASE 		|| config.DATABASE;

// The controllers
//------------------------------------------
var ctrlUserSignup 		= require('./controllers/user/signup');
var ctrlUserSendEmail	= require('./controllers/user/sendEmail');
var ctrlUserVerifyEmail = require('./controllers/user/verifyEmail');
var ctrlUserSignin		= require('./controllers/user/signin');
var ctrlUserAuthenticate= require('./controllers/user/authenticate');


// Prepare Express server
//------------------------------------------
var app = express();
var api = express.Router();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use('/api/v1.0',api);

// Connect to database Mongoose
//------------------------------------------
mongoose.connect(DATABASE,function(err){
	if (err) throw err;
	console.log("DATABASE is connceted successfully ! ");
});




// The routes
//------------------------------------------
app.get('/',function(req,res){res.json({msg:'welcome to server'});});
app.post('/signup', ctrlUserSignup);
app.get('/verify', ctrlUserVerifyEmail);

//with authentication
//------------------------------------------
api.use(ctrlUserAuthenticate);
app.post('/singin', ctrlUserSignin);




// Run the server
//------------------------------------------
app.listen(PORT,function(err){
	console.log('The server is running on http://localhost:' + PORT);
});

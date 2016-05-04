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
var SECRET 			= process.env.SECRET 		|| config.SECRET;
var SECRET_EMAIL 	= process.env.SECRET_EMAIL 	|| config.SECRET_EMAIL;
var DATABASE		= process.env.DATABASE 		|| config.DATABASE;


// The controllers
//------------------------------------------
var ctrlUserSignup 		= require('./controllers/user/signup');
var ctrlUserSendEmail	= require('./controllers/user/sendEmail');
var ctrlUserVerifyEmail = require('./controllers/user/verifyEmail');
var ctrlUserAuthenticate= require('./controllers/user/auth');

// Prepare Express server
//------------------------------------------
var app = express();
var API = express.Router();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use('/api/v1.0',API);

// Connect to database Mongoose
//------------------------------------------
mongoose.connect(DATABASE,function(err){
	if (err) throw err;
	console.log("DATABASE is connceted successfully ! ");
});

app.get('/',function(req,res){
	res.json({
		msg:'welcome to server'
	});
});


// The routes
//------------------------------------------

app.post('/signup', ctrlUserSignup);
//app.post('/authenticate', ctrlUserAuthenticate);
app.get('/verify', ctrlUserVerifyEmail);





// Run the server
//------------------------------------------
app.listen(PORT,function(err){
	console.log('The server is running on http://localhost:' + PORT);
});
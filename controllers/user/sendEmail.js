var jwt = require('jsonwebtoken');
var config = require(require('path').dirname(require.main.filename) + '/config'); // get db config file
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport(process.env.EMAIL_CONNECTION || config.EMAIL_CONNECTION);
var host = 'http://localhost:8080/verify';

var SECRET_EMAIL = process.env.SECRET_EMAIL || config.SECRET_EMAIL;
var send = function(payload, callback) {
    var myUsername = payload.username;
    var payloadSubject = payload.subject;
    var token = jwt.sign(payload, SECRET_EMAIL, {
        expiresIn: 86400 // expires in 24 hours
    });
    if (payloadSubject == 'changePassword') {
    	var mailOptions = {
            from: '"FaisalKANOUT 👥" <foo@blurdybloop.com>', // sender address
            to: 'f.kanout@gmail.com', // list of receivers
            subject: 'Reset accounts password', // Subject line
            text: 'Hello', // plaintext body
            html: '<h2> Hello ' + myUsername + '</h2>' +
                '<br> Please click on the link to reset you account password :<br>' +
                host + '?id=' + token+ '<br>'+
                'If you did not ask for reset you password account please igone this message'

        };

    };
    if (payloadSubject == 'verifyEmail') {
        var mailOptions = {
            from: '"FaisalKANOUT 👥" <foo@blurdybloop.com>', // sender address
            to: 'f.kanout@gmail.com', // list of receivers
            subject: 'Email verification', // Subject line
            text: 'Hello', // plaintext body
            html: '<h2> Hello ' + myUsername + '</h2>' +
                '<br> Please click on the link to verify your email:<br>' +
                host + '?id=' + token
        };
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            return callback(error)
            console.log(error);
        }
        console.log('Message sent: ' + info.response);
        return callback(null, info);
    });

};

module.exports = send;

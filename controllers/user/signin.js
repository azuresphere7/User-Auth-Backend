
"use strict";

var jwt = require('jsonwebtoken');
var config = require(require('path').dirname(require.main.filename) + '/config'); // get db config file
var mongoose = require('mongoose');
var user = require(require('path').dirname(require.main.filename) + '/models/user'); // get the mongoose model
var sendEmail = require(require('path').dirname(require.main.filename) + '/controllers/user/sendEmail'); // get the mongoose model

var SECRET = process.env.SECRET || config.SECRET;

module.exports = function(req, res) {
    if ((req.body.username) && (req.body.password)) {
        var myUsername = (req.body.username).toLowerCase();
        user.findOne({ username: myUsername }, function(err, user) {
            if (err) throw err;
            if (!user) {
                res.status(403).send({
                    success: false,
                    message: 'There is no username found !'
                });
            };
            if (user) {
                user.comparePassword(req.body.password, function(err, matched) {
                    if (err) throw err;
                    if (!matched) {
                        res.status(403).send({
                            success: false,
                            message: 'Wronge password try agine'
                        });
                    };
                    if (matched) {

                        if (user.meta.validated) {
                            var userToSend = {
                                username: user.username,
                                idPayload: user.meta.id,
                                type: 'c_user'
                            };
                            var token = jwt.sign(userToSend, SECRET, {
                                expiresIn: 60
                            });

                            res.status(200).send({
                                success: true,
                                message: 'Take this token :) ',
                                token: token
                            });
                        } else {
                            var idPayload = Math.floor((Math.random() * 1000000000000000) + 1);
                            var payload = ({
                                subject: 'verifyEmail',
                                author: 'Najla KANOUT, Faisal KANOUT',
                                id: idPayload,
                                username: myUsername,
                            });
                            user.meta.id = idPayload;
                            user.save(function(err) {
                                if (err) throw err;
                                sendEmail(payload, function(err) {
                                    if (err) throw err;
                                    res.status(200).send({
                                        success: true,
                                        message: 'Your account is not valid yet, We sent you an email to ' + myUsername + ' to validate you email address befor you can signin',
                                    });
                                });
                            });
                        };
                    };
                });
            };
        });
    };
    if (!myUsername) {
        res.status(403).send({
            success: false,
            message: 'There is no username provided !'
        })
    };
};

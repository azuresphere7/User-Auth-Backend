"use strict";

var config = require(require('path').dirname(require.main.filename) + '/config'); 
var mongoose = require('mongoose');
var user = require(require('path').dirname(require.main.filename) + '/models/user'); 
var sendEmail = require(require('path').dirname(require.main.filename) + '/controllers/user/sendEmail'); 


module.exports = function(req, res) {
    if ((req.body.username)&&(req.body.password)) {
        myUsername = (req.body.username).toLowerCase();
        if (myUsername) {
            user.findOne({ username: myUsername }, function(err, user) {
                if (err) throw err;
                if (!user) {
                    res.status(403).send({
                        success: false,
                        message: 'There is no username found !'
                    });
                };
                if (user) {
                    var idPayload = Math.floor((Math.random() * 1000000000000000) + 1);
                    var payload = ({
                        subject: 'changePassword',
                        author: 'Najla KANOUT, Faisal KANOUT',
                        id: idPayload,
                        username: myUsername,
                        password:req.body.password
                    });
                    user.meta.id = idPayload;
                    user.save(function(err) {
                        if (err) throw err;
                        if (!err) {
                            sendEmail(payload, function(err) {
                                res.status(200).send({
                                    success: true,
                                    message: 'We sent to you an email to this adress ' + user.username + ' to reset your password'
                                });
                            });
                        }
                    });
                };
            });
        };

        if (!myUsername) {
            res.status(403).send({
                success: false,
                message: 'There is no username provided !'
            });
        };
    } else {
        res.status(403).send({
            success: false,
            message: 'The name of parameters provided are not good !'
        });
    }

};

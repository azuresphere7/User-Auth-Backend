"use strict";

var jwt = require('jsonwebtoken');
var config = require(require('path').dirname(require.main.filename) + '/config'); // get db config file
var user = require(require('path').dirname(require.main.filename) + '/models/user'); // get the mongoose model
var mongoose = require('mongoose');
var SECRET_EMAIL = process.env.SECRET_EMAIL || config.SECRET_EMAIL;

module.exports = function(req, res) {
    var token = req.param('id');
    if (token) {
        jwt.verify(token, SECRET_EMAIL, function(err, payload) {
            if (err) {
                res.status(403).send({
                    success: false,
                    message: 'Your token id is not valid !'
                });
            };
            if (payload) {
                if (payload.subject == 'verifyEmail') {
                    user.findOne({
                        $and: [{ username: payload.username }, { 'meta.id': payload.id }]
                    }, function(err, user) {
                        if (err) throw err;
                        if (!user) {
                            res.status(403).send({
                                success: false,
                                message: 'There is no user with this information !'
                            });
                        };
                        if (user) {
                            if (user.meta.validated == true) {
                                res.status(200).send({
                                    success: true,
                                    message: 'your account ' + user.username + ' is already activated'
                                });
                            } else {
                                user.meta.validated = true;
                                user.save(function(err) {
                                    res.status(201).send({
                                        success: true,
                                        message: 'your account ' + user.username + ' is now activated'
                                    });

                                });
                            }
                        }
                    });

                };
                if (payload.subject == 'changePassword') {
                    user.findOne({
                        $and: [{ username: payload.username }, { 'meta.id': payload.id }]
                    }, function(err, user) {
                        if (err) throw err;
                        if (!user) {
                            res.status(403).send({
                                success: false,
                                message: 'There is no user with this information !'
                            });
                        };
                        if (user) {
                            user.password = payload.password;
                            user.save(function(err) {
                                res.status(201).send({
                                    success: true,
                                    message: 'your accounts ' + user.username + ' password has been changed successfully !'
                                });
                            });
                        };
                    });

                };
            };
        });

    } else {
        res.status(403).send({
            success: false,
            message: 'The parameters is not valid'
        });
    }
};

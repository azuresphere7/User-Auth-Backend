var config = require(require('path').dirname(require.main.filename) + '/config'); // get db config file
var mongoose = require('mongoose');
var user = require(require('path').dirname(require.main.filename) + '/models/user'); // get the mongoose model
var sendEmail = require(require('path').dirname(require.main.filename) + '/controllers/user/sendEmail'); // get the mongoose model


module.exports = function(req, res) {
    if (req.body.username) {
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
                    });
                    user.meta.id = idPayload;
                    user.save(function(err) {
                        if (err) throw err;
                        if (!err) {
                            sendEmail(payload, function(err) {
                                res.status(201).send({
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
    };
    if (!req.body.username) {
        res.status(403).send({
            success: false,
            message: 'The name of parameters provided are not good !'
        });
    }

};

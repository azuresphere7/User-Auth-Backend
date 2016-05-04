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
            } else {
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
                            user.meta.validated = true;
                            user.save(function(err) {
                                res.status(201).send({
                                    success: true,
                                    message: 'your account ' + user.username + ' is now activated'
                                });

                            });
                        }
                    });

                } else {
                    res.status(403).send({
                        success: false,
                        message: 'Unknown token subject !'
                    });

                }
            };
        });

    } else {
        res.status(403).send({
            success: false,
            message: 'The parameters is not valid'
        });
    }
};

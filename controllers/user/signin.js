var jwt = require('jsonwebtoken');
var config = require(require('path').dirname(require.main.filename) + '/config'); // get db config file
var mongoose = require('mongoose');
var user = require(require('path').dirname(require.main.filename) + '/models/user'); // get the mongoose model

var SECRET = process.env.SECRET || config.SECRET;

module.exports = function(req, res) {
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
                user.comparePassword(req.body.password, function(err, matched) {
                    if (err) throw err;
                    if (!matched) {
                        res.status(403).send({
                            success: false,
                            message: 'Wronge password try agine'
                        });
                    };
                    if (matched) {
                        var token = jwt.sign(user, SECRET, {
                            expiresIn: 60
                        });
                        res.status(200).send({
                            success: true,
                            message: 'Enjoy your token!',
                            token: token
                        });
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

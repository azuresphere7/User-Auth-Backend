var mongoose = require('mongoose');
var user = require(require('path').dirname(require.main.filename) + '/models/user'); // get the mongoose model
var sendEmail = require(require('path').dirname(require.main.filename) + '/controllers/user/sendEmail'); // get the mongoose model

module.exports = function(req, res) {
    myUsername = (req.body.username).toLowerCase();
    myPassword = req.body.password;
    if ((myUsername) && (myPassword)) {
        user.findOne({ username: myUsername }, function(err, myUser) {
            if (err) throw err;
            if (myUser) {
                res.status(403).send({
                    success: false,
                    username: myUsername,
                    message: 'This username is already exite !'
                });
            } else {
                var idPayload = Math.floor((Math.random() * 1000000000000000) + 1);
                var newUser = new user({
                    username: myUsername,
                    password: myPassword,
                    meta: {
                        id: idPayload
                    }
                });
                var payload = ({
                    subject: 'verifyEmail',
                    author: 'Najla KANOUT, Faisal KANOUT',
                    id: idPayload,
                    username: myUsername,
                });
                sendEmail(payload, function(err) {
                    if (err) throw err;
                    newUser.save(function(err) {
                        if (err) throw err;
                        res.status(201).send({
                            success: true,
                            username: myUsername,
                            message: 'User created successfully'
                        });
                    });
                });
            };
        });
    } else {
        res.status(403).send({
            success: false,
            message: 'The parameters you have entered are not valid !'
        });
    };
};

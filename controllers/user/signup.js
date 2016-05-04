var mongoose = require('mongoose');
var user = require(require('path').dirname(require.main.filename) + '/models/user'); // get the mongoose model
var sendEmail = require(require('path').dirname(require.main.filename) + '/controllers/users/sendEmail'); // get the mongoose model

module.exports = function(req, res) {
    myUsername = (req.body.username).toLowerCase();
    myPassword = req.body.password;
    user.findOne({ username: myUsername }, function(err, myUser) {
        if (err) throw err;
        if (myUser) {
            res.status(403).send({
                success: false,
                username: myUsername,
                message: 'This username is already exite !'
            });
        };
        var idPayload = Math.floor((Math.random() * 1000000000000000) + 1);
        
        var newUser = new user({
            username: myUsername,
            password: myPassword,
            meta:{
            	id:idPayload
            }
        });

        var payload = ({
        	author: 'Najla KANOUT, Faisal KANOUT',
        	id: idPayload,
        	username: myUsername,
        });
        

    });
};

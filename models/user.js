var bcrypt		= require('bcrypt');
var mongoose	= require('mongoose');
var schema 		= mongoose.Schema;
var user 		= new schema({
    username: { type: String, unique: true, required: true, unique: true },
    password: String,
    fullName: String,
    image: String,
    plates: [{
        plate: String,
        notif: [{
            sender: String,
            date: Date,
            body: String
        }]
    }],
    meta: {
        dateCreating: { type: Date, default: Date.now },
        isValid: { type: Boolean, default: false },
        id: Number
    }
});

user.pre('save', function(next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function(err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) {
                    return next(err);
                }
                user.username = user.username.toLowerCase();
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

user.methods.comparePassword = function(pass, callback) {
    bcrypt.compare(pass, this.password, function(err, isMatch) {
        if (err) {
            return callback(err);
        }
        callback(null, isMatch);
    });
};
module.exports = mongoose.model('USER_DB_API_V1', user);


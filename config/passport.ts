import passport = require('passport');
import * as passportJWT from 'passport-jwt';
import UserModel from '../models/UserModel';

const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'secret'
}

export default function passport_verify(passport: any) {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        UserModel.findById(jwt_payload._id)
            .then(user => {
                if(user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            })
    }))
}
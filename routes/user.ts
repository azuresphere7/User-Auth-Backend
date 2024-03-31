import * as express from 'express';
import * as passport from 'passport';
import UserController from '../controllers/UserController';
import RegisterValidationSchema from '../validations/RegisterValidationSchema';
import LoginValidationSchema from '../validations/LoginValidationSchema';

const router: express.Router = express.Router();

router.post('/register', RegisterValidationSchema, UserController.register);
router.post('/login', LoginValidationSchema, UserController.login);
router.get('/access-token', passport.authenticate('jwt', {session: false}), UserController.accessToken);

export default router;
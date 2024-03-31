import { body } from 'express-validator';

const LoginValidationSchema = [
    body('email')
        .notEmpty()
        .isEmail(),

    body('password')
        .notEmpty()
];

export default LoginValidationSchema;
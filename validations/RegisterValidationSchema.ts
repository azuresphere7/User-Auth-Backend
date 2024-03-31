import { body } from 'express-validator';

const RegisterValidationSchema = [
    body('email')
        .notEmpty()
        .isEmail(),
        
    body('firstname')
        .notEmpty()
        .isString(),

    body('lastname')
        .notEmpty()
        .isString(),

    body('password')
        .notEmpty()
        .isString()
        .isLength({ min: 6, max: 30 }),

    body('confirm')
        .notEmpty()
        .isString()
        .custom((value, {req}) => value === req.body.password)
];

export default RegisterValidationSchema;
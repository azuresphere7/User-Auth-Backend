import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';

import UserModel from "../models/UserModel";

export default class UserController {
    static async register(req: Request, res: Response) {
        const { errors }: any = validationResult(req);

        if(errors.length > 0) {
            res.status(401).json({
                success: false,
                message: "Fields are invalid"
            });
        } else {
            const data = matchedData(req);
    
            await UserModel.findOne({ email: data.email })
                .then(user => {
                    if(user) {
                        res.status(404).json({
                            success: false, 
                            message: "The user already exists."
                        });
                    } else {
                        const newUser: any = new UserModel(data);
    
                        bcrypt.genSalt(10, (error, salt) => {
                            bcrypt.hash(newUser.password, salt, async (error, hash) => {
                                newUser.password = hash;
                                await newUser.save()
                                    .then((user: any) => res.status(200).json({
                                        success: true,
                                        message: 'Successfully registered',
                                        user
                                    }));
                            });
                        });
                    }
                });
        }
    }

    static async login(req: Request, res: Response) {
        const { errors }: any = validationResult(req);

        if(errors.length > 0) {
            res.status(401).json({
                success: false,
                message: "Fields are invalid"
            });
        } else {
            const data = matchedData(req);

            await UserModel.findOne({ email: data.email })
                .then(user => {
                    if(!user) {
                        res.status(404).json({
                            success: false,
                            message: "The user does not exist"
                        });
                    } else {
                        bcrypt.compare(data.password, user.password)
                            .then((isMatch: boolean) => {
                                if(isMatch) {
                                    const payload = {
                                        _id: user._id,
                                        email: user.email,
                                        password: user.password
                                    }

                                    jwt.sign(payload, 'secret', { expiresIn: 3600 }, (err, token) => {
                                        res.status(200).json({
                                            success: true,
                                            message: "Welcome back!",
                                            token
                                        });
                                    });
                                } else {
                                    res.status(401).json({
                                        success: false,
                                        message: "Password is incorrect"
                                    })
                                }
                            })
                    }
                })
        }
    }

    static async accessToken(req: Request, res: Response) {
        res.status(200).json(_.pick(req.user, ['email', 'firstname', 'lastname', 'date']));
    }
}
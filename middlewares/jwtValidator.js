import { request, response } from 'express';
import jwt from 'jsonwebtoken';
//import mongoose from 'mongoose';
import { User } from '../models/User.js';
export const jwtValidator = async (req = request, res = response, next) => {
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            const jsonwebtoken = req.headers.authorization.split(' ')[1];
            const { id } = jwt.verify(
                jsonwebtoken,
                process.env.SECRET_JWT_SEED
            );

            const user = await User.findById(id).select(
                '-password -createdAt -updatedAt -token -__v'
            );
            if (!user) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Token no válido'
                });
            }

            req.user = user

            return next();
        } catch (error) {
            console.log(error);
            return res.status(404).json({
                ok: false,
                msg: 'Token no válido'
            });
        }
    }

    return res.status(401).json({
        ok: false,
        msg: 'Token no válido'
    });
};

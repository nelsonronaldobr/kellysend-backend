import { request, response } from 'express';
import jwt from 'jsonwebtoken';
//import mongoose from 'mongoose';
import { User } from '../models/User.js';
export const checkAuth = async (req = request, res = response, next) => {
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer') && !req.headers.authorization.endsWith('null')
    ) {
        try {
            const jsonwebtoken = req.headers.authorization.split(' ')[1];
            const { id } = jwt.verify(
                jsonwebtoken,
                process.env.SECRET_JWT_SEED
            );

            req.user = await User.findById(id).select(
                '-password -createdAt -updatedAt -token -__v'
            );
        } catch (error) {
            console.log(error);
            return res.status(404).json({
                ok: false,
                messages: { type: 'error', msg: 'Algo salió mal, Por favor comuniquese con el Administrador' }
            });
        }
    }

    return next();
};

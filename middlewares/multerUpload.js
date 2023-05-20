import { request, response } from 'express';
import { __dirname } from '../helpers/globals.js';
import multer from 'multer';
import { generate } from 'shortid';

const fileStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, `${__dirname}/../uploads`);
    },
    filename: (req, file, callback) => {
        const extension = file.originalname.substring(
            file.originalname.lastIndexOf('.'),
            file.originalname.length
        );
        callback(null, `${generate()}${extension}`);
    }
});

export const multerUpload = async (req = request, res = response, next) => {
    const multerConfig = {
        limits: { fileSize: req.user ? 1024 * 1024 * 10 : 1024 * 1024 },
        storage: fileStorage
    };

    const upload = multer(multerConfig).single('file');

    upload(req, res, async (error) => {
        if (!error) {
            return next();
        }
        return res.status(404).json({
            ok: false,
            code: error.code,
            msg: error.message
        });
    });
};

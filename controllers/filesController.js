import { request, response } from 'express';
import fs from 'fs';
import { __dirname } from '../helpers/globals.js';
import { Links } from '../models/Link.js';
import { log } from 'console';


export const uploadFile = async (req = request, res = response) => {
    res.json({
        ok: true, file: {
            filename: req.file.filename
        },
        messages: {
            type: 'success',
            msg: 'El archivo se ha subido con exito'
        }
    });
};

export const deleteFile = async (req = request, res = response) => {
    try {
        fs.unlinkSync(`${__dirname}/../uploads/${req.file}`);

    } catch (error) {
        console.log(error);
        return res.status(404).json({
            ok: false,
            messages: { type: 'error', msg: 'Algo salió mal, Por favor comuniquese con el Administrador' }
        });
    }
};


export const getFile = async (req = request, res = response, next) => {
    const { name } = req.params;

    try {
        const imagePath = __dirname + '/../uploads/' + name;
        if (fs.existsSync(imagePath)) {
            res.download(imagePath)
        }

        const link = await Links.findOne({ name });
        if (link) {
            if (link.downloads === 1) {
                req.file = link.name;
                await Links.deleteOne({ name });
                next()
            } else {
                link.downloads--;
                await link.save();
            }
        }

    } catch (error) {
        console.log(error);
    }
}
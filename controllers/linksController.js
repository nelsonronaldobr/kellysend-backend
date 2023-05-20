import { request, response } from 'express';
import { generate } from 'shortid';
import { Links } from '../models/Link.js';
import { __dirname } from '../helpers/globals.js';
import fs from "fs";
export const createLink = async (req = request, res = response) => {
    const { original_name, name } = req.body;
    const extension = original_name.split('.')[1];
    const link = new Links();
    link.url = generate();
    link.name = name;
    link.original_name = original_name;
    link.extension = extension;

    if (req.user) {
        const { password, downloads } = req.body.options;
        link.password = password ?? null;
        link.downloads = downloads ?? 1;
        link.author = req.user.id;
    }

    try {
        await link.save();
        res.json({ ok: true, url: link.url, messages: { type: 'success', msg: 'Link creado exitosamente' } });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            messages: { type: 'error', msg: 'Algo salió mal, Por favor comuniquese con el Administrador' }
        });
    }
};

export const getLinkAfter = async (req = request, res = response, next) => {

    const { name } = req.params;
    try {
        const link = await Links.findOne({ name });
        if (!link) {
            return res.status(404).json({
                ok: false,
                messages: { type: 'error', msg: 'El enlace no existe' }
            });
        }

        if (link.downloads === 1) {
            req.file = link.name;
            await Links.deleteOne({ name });
            next();
        } else {
            link.downloads--;
            await link.save();
        }
    } catch (error) {
        res.status(500).json({
            ok: false,
            messages: { type: 'error', msg: 'Algo salió mal, Por favor comuniquese con el Administrador' }
        });
    }
};


export const getFilePreview = async (req = request, res = response, next) => {
    const { url } = req.params;
    try {
        const link = await Links.findOne({ url }).select('-id -created_at');
        if (!link) {
            return res.status(404).json({
                ok: false,
                messages: { type: 'error', msg: 'El enlace no existe' }
            });
        }

        const imagePath = __dirname + '/../uploads/' + link.name;

        if (!fs.existsSync(imagePath)) {
            return res.status(404).json({
                ok: false,
                messages: { type: 'error', msg: 'Algo salió mal, Por favor comuniquese con el Administrador' }
            });
        }

        res.status(200).json(
            {
                ok: true,
                link: {
                    downloads: 1,
                    author: null,
                    url: link.url,
                    name: link.name,
                    original_name: link.original_name,
                    extension: link.extension,
                    hasPassword: !!link.password
                },
                messages: { type: 'success', msg: 'Su archivo esta listo para ser descargado' }
            }
        )
    } catch (error) {
        res.status(500).json({
            ok: false,
            messages: { type: 'error', msg: 'Algo salió mal, Por favor comuniquese con el Administrador' }
        });
    }
};

export const verifyPassword = async (req = request, res = response, next) => {
    const { url } = req.params;
    const { password } = req.body;
    try {
        const link = await Links.findOne({ url }).select('-id -created_at');
        if (!link) {
            return res.status(404).json({
                ok: false,
                messages: { type: 'error', msg: 'El enlace no existe' }
            });
        }

        if (await link.authentication(password)) {

            return res.status(200).json(
                {
                    ok: true,
                    link: {
                        downloads: 1,
                        author: null,
                        url: link.url,
                        name: link.name,
                        original_name: link.original_name,
                        extension: link.extension,
                        verify: true
                    },
                    messages: { type: 'success', msg: 'Comprobación exitosa' }
                }
            )
        }

        return res.status(403).json({
            ok: false,
            messages: { type: 'error', msg: 'Verifique la contraseña' }
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            messages: { type: 'error', msg: 'Algo salió mal, Por favor comuniquese con el Administrador' }
        });
    }
}
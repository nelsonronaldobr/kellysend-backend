import { response, request } from 'express';
import { User } from '../models/User.js';
import { generateToken } from '../helpers/generateToken.js';
import { generateJWT } from '../helpers/generateJWT.js';
import { emailRegister } from '../helpers/sendMail.js';
import { v2 as cloudinary } from 'cloudinary';

const register = async (req = request, res = response) => {
    const { email } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                ok: false,
                messages: { type: 'error', msg: 'El correo se encuentra en uso' }
            });
        }
        user = new User(req.body);
        user.token = generateToken();
        await user.save();

        //const jsonwebtoken = await generateJWT(user.id, user.username);

        //! enviar el email de confirmacion
        await emailRegister({
            email: user.email,
            name: user.username,
            token: user.token
        })

        res.json({
            ok: true,
            //jwt: jsonwebtoken,
            /* user: {
                email: user.email,
                username: user.username,
                confirmed: user.confirmed,
                photo_profile: user.photo_profile
            }, */
            messages: { type: 'warning', msg: 'Registro existoso, hemos enviado un email con las intrucciones para que confirmes tu cuenta.' }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            messages: { type: 'error', msg: 'Algo salió mal, Por favor comuniquese con el Administrador' }
        });
    }
};

const login = async (req = request, res = response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                ok: false,
                messages: { type: 'error', msg: 'El usuario no existe' }
            });
        }

        if (await user.authentication(password)) {

            if (!user.confirmed) {
                return res.status(403).json({
                    ok: false,
                    messages: { type: 'error', msg: 'Verifique su cuenta, se le ha enviado un correo con las intrucciones' }
                });
            }

            const jsonwebtoken = await generateJWT(user.id, user.username);
            return res.status(200).json({
                ok: true,
                jwt: jsonwebtoken,
                user: {
                    email: user.email,
                    username: user.username,
                    confirmed: user.confirmed,
                    photo_profile: user.photo_profile
                }
            });
        }

        return res.status(403).json({
            ok: false,
            messages: { type: 'error', msg: 'Credenciales incorrectas' }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            messages: { type: 'error', msg: 'Algo salió mal, Por favor comuniquese con el Administrador' }
        });
    }
};

const renew = async (req = request, res = response) => {
    const { id, username, email, confirmed, photo_profile } = req.user;
    const jsonwebtoken = await generateJWT(id, email);

    res.status(200).json({
        ok: true,
        jwt: jsonwebtoken,
        user: {
            email: email,
            username: username,
            confirmed: confirmed,
            photo_profile: photo_profile
        }
    });
};

const getProfilePhoto = async (req = request, res = response) => {

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });


    try {
        const folderName = 'profiles';
        const { resources } = await cloudinary.search
            .expression(`folder:${folderName}`)
            .execute();

        const imageUrls = resources.map(resource => cloudinary.url(resource.public_id));

        res.status(200).json({ ok: true, imageUrls });
    } catch (error) {
        console.error('Error al obtener las imágenes de Cloudinary', error);
        res.status(500).json({ ok: false, messages: { type: 'error', msg: 'Error al obtener las imágenes de Cloudinary' } });
    }
}

const confirmAccount = async (req = request, res = response) => {
    const { token } = req.params
    try {

        const user = await User.findOne({ token })
        console.log(user);
        if (!user) {
            return res.status(401).json({
                ok: false,
                messages: { type: 'error', msg: 'Algo salió mal, Por favor comuniquese con el Administrador' }
            });
        }

        user.token = ""
        user.confirmed = true
        await user.save()

        const jsonwebtoken = await generateJWT(user.id, user.username);

        res.json({
            ok: true,
            jwt: jsonwebtoken,
            user: {
                email: user.email,
                username: user.username,
                confirmed: user.confirmed,
                photo_profile: user.photo_profile
            },
            messages: { type: 'success', msg: 'Su cuenta ha sido confirmada correctamente' }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            messages: { type: 'error', msg: 'Algo salió mal, Por favor comuniquese con el Administrador' }
        });
    }
}

const saveProfile = async (req = request, res = response) => {

    const { photo_profile } = req.body
    const { id } = req.user


    try {
        const user = await User.findById(id)
        user.photo_profile = photo_profile
        await user.save()
        res.status(200).json({
            ok: true,
            user: { photo_profile },
            messages: { type: 'success', msg: 'Perfil guardado con exito' }
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            messages: { type: 'error', msg: 'Algo salió mal, Por favor comuniquese con el Administrador' }
        });
    }
}

export { register, login, renew, getProfilePhoto, confirmAccount, saveProfile };

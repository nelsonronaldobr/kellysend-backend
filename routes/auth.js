import { Router } from 'express';
import {
    login,
    register,
    renew,
    getProfilePhoto,
    confirmAccount,
    saveProfile
} from '../controllers/authController.js';
import { check } from 'express-validator';
import { messagesValidator } from '../middlewares/messagesValidator.js';
import { jwtValidator } from '../middlewares/jwtValidator.js';

const router = Router();

router.post(
    '/register',
    [
        check('username', 'El username es obligatorio').not().isEmpty(),
        check('email', 'Agrega un email válido').isEmail(),
        check(
            'password',
            'El password debe ser de al menos 6 caracteres'
        ).isLength({ min: 6 }),
        messagesValidator
    ],
    register
);

router.post(
    '/',
    [
        check('email', 'Agrega un email válido').isEmail(),
        check(
            'password',
            'El password debe ser de al menos 6 caracteres'
        ).isLength({ min: 6 }),
        messagesValidator
    ],
    login
);

router.get('/confirm-account/:token', confirmAccount);
router.get('/profiles', getProfilePhoto);
router.post(
    '/profile',
    jwtValidator,
    saveProfile
);

router.get('/renew', jwtValidator, renew);

export default router;

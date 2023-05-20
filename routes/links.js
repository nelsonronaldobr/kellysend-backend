import { Router } from 'express';
import { check } from 'express-validator';
import { messagesValidator } from '../middlewares/messagesValidator.js';
import { createLink, getFilePreview, verifyPassword } from '../controllers/linksController.js';
import { checkAuth } from '../middlewares/checkAuth.js';

const router = Router();

router.post(
    '/',
    [
        check('original_name', 'Sube un archivo').not().isEmpty(),
        check('name', 'Sube un archivo').not().isEmpty(),
        messagesValidator
    ],
    checkAuth,
    createLink
);

//router.get('/delete/:url', getLinkAfter, deleteFile);

router.get('/:url', getFilePreview)
router.post('/:url', verifyPassword)


export default router;

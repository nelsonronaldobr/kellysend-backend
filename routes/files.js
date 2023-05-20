import { Router } from 'express';
import { checkAuth } from '../middlewares/checkAuth.js';
import { uploadFile, getFile, deleteFile } from '../controllers/filesController.js';
import { multerUpload } from '../middlewares/multerUpload.js';

const router = Router();

// uploads files

router.post('/', checkAuth, multerUpload, uploadFile);
router.get('/:name', getFile, deleteFile);

export default router;

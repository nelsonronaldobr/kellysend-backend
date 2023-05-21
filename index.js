import { config } from 'dotenv';
import express, { request } from 'express';
import { connectDB } from './database/config.js';
import authRoutes from './routes/auth.js';
import linksRoutes from './routes/links.js';
import filesRoutes from './routes/files.js';
import cors from "cors";
import { __dirname } from './helpers/globals.js';
import { validateString } from './helpers/validateString.js';

config();
// crear sevidor
const app = express();
// conectar a la base de datos
connectDB();

// Lectura y parseo del body
app.use(express.json());

app.use(cors(app.use(cors({ origin: process.env.FRONTEND_URL_BASE, allowedHeaders: ["Authorization", "Content-Type"] }))));
console.log(process.env.FRONTEND_URL_BASE);

app.use((req, res, next) => {
    if (req.url.startsWith('/uploads') || validateString(req.url)) {
        return res.sendStatus(403);
    }
    next();
});


app.use('/uploads', express.static('uploads'))


/* -------------------------------------------------------------------------- */
/*                                   ROUTES                                   */
/* -------------------------------------------------------------------------- */

app.use('/api/auth', authRoutes);
app.use('/api/links', linksRoutes);
app.use('/api/files', filesRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`El servidor corre en el puerto ${PORT}`);
});

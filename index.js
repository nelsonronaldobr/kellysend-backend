import { config } from 'dotenv';
import express from 'express';
import { connectDB } from './database/config.js';
import authRoutes from './routes/auth.js';
import linksRoutes from './routes/links.js';
import filesRoutes from './routes/files.js';
import cors from "cors";
import { validateString } from './helpers/validateString.js';

config();
// crear sevidor
const app = express();
// conectar a la base de datos
connectDB();

// Lectura y parseo del body
app.use(express.json());

const whiteList = [
    process.env.FRONTEND_URL_BASE
];

const corsOptions = {
    origin: function (origin, callback) {
        console.log(origin);
        console.log('VERIFY', whiteList.includes(origin));
        if (whiteList.includes(origin)) {
            callback(null, true)

        } else {
            callback(new Error("Error de Cors"))
        }
    },
}

app.use((req, res, next) => {
    if (req.url.startsWith('/uploads') || validateString(req.url)) {
        return res.sendStatus(403);
    }
    next();
});

app.use('/uploads', express.static('uploads'))

app.use(cors(corsOptions))

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

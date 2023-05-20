import { config } from 'dotenv';
import express from 'express';
import { connectDB } from './database/config.js';
import authRoutes from './routes/auth.js';
import linksRoutes from './routes/links.js';
import filesRoutes from './routes/files.js';
import cors from "cors";
config();
// crear sevidor
const app = express();
// conectar a la base de datos
connectDB();

// Lectura y parseo del body
app.use(express.json());

app.use(express.static('uploads'))

const whiteList = [
    process.env.FRONTEND_URL_BASE
];

const corsOptions = {
    origin: function (origin, callback) {
        if (whiteList.includes(origin)) {
            callback(null, true)

        } else {
            callback(new Error("Error de Cors"))
        }
    },
}

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

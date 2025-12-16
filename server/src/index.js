import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import express from 'express';
import conexion from './config/database.js'; 
import User from './models/User.js';
import rutasAuth from './routes/rutasAuth.js';
import rutasVideos from './routes/rutasVideos.js';
import Favorito from './models/Favorite.js';
import rutasFavoritos from './routes/favoritos.js';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();
app.use(cookieParser()); 
app.use(express.json());
app.set('trust proxy', 1);

app.use(express.json());

const listaBlanca = [
    'http://localhost:5173',                       
    'https://innovatube-frontend-rz18.onrender.com'  
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || listaBlanca.includes(origin)) {
            callback(null, true);
        } else {
            console.log("Bloqueado por CORS:", origin);
            callback(new Error('No permitido por CORS'));
        }
    },
    credentials: true 
}));

app.use(helmet());
app.use(morgan('dev'));

// API
app.use('/api/auth', rutasAuth);
app.use('/api/videos', rutasVideos);
app.use('/api/favoritos', rutasFavoritos);

app.get('/', (req, res) => {
  res.json({ message: 'Servidor activo' });
});

async function iniciarServidor() {
  try {
    await conexion.sync({ force: false });
    console.log('BD lista y sincronizada');

    const PORT = process.env.PORT || 3000; 
    
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Error en la BD:', error);
  }
}

iniciarServidor();
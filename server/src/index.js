import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import express from 'express';
import conexion from './config/database.js'; 
import User from './models/User.js';
import rutasAuth from './routes/rutasAuth.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true 
  }));

app.use(helmet());
app.use(morgan('dev'));
//API
app.use('/api/auth', rutasAuth);

app.get('/', (req, res) => {
  res.json({ message: 'Servidor activo' });
});


async function iniciarServidor() {
  try {
    await conexion.sync({ force: false });
    console.log('BD lista y sincronizada');

    app.listen(PORT, () => {
      console.log(`Servidor arriba en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error en la BD:', error);
  }
}

iniciarServidor();
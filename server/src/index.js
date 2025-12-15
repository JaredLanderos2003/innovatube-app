import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import express from 'express';
import sequelize from './config/database.js';
import User from './models/User.js'; // Registro del modelo

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Ruta base
app.get('/', (req, res) => {
  res.json({ message: 'Servidor activo' });
});

// Inicio del servidor
async function iniciarServidor() {
  try {
    await sequelize.sync({ force: false });
    console.log('BD lista');

    app.listen(PORT, () => {
      console.log(`Servidor arriba en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log('Fallo al iniciar la base de datos:');
  }
}

iniciarServidor();

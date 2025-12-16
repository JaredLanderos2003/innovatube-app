import Sequelize from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

let conexion;

if (process.env.DATABASE_URL) {
    conexion = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    });
} else {
  //Local
    conexion = new Sequelize(
        process.env.DB_NAME, 
        process.env.DB_USER, 
        process.env.DB_PASSWORD, 
        {
            host: process.env.DB_HOST,
            dialect: 'postgres',
            port: process.env.DB_PORT,
            logging: false
        }
    );
}

export default conexion;
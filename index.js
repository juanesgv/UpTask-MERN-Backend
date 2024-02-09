import express from 'express'
import conectarBD from './config/db.js';
import dotenv from 'dotenv'

const app = express();

dotenv.config()
const PORT = process.env.PORT || 4000;

conectarBD();

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})
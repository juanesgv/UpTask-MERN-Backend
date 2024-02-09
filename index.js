import express from 'express'
import conectarBD from './config/db.js';
import dotenv from 'dotenv'
import usuarioRoutes from './routes/usuarioRoutes.js'

const app = express();
app.use(express.json()) //procesa la información de tipo json

dotenv.config() //Permite el llamado de las variables de entorno (.env)

//routing
app.use('/api/usuarios', usuarioRoutes) //el use hace referencia a todos los verbos http

const PORT = process.env.PORT || 4000;

conectarBD();

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})
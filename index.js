import express from 'express'
import conectarBD from './config/db.js';
import dotenv from 'dotenv'
import usuarioRoutes from './routes/usuarioRoutes.js'
import proyectoRoutes from './routes/proyectoRoutes.js'
import tareaRoutes from './routes/tareaRoutes.js'
import cors from "cors"

const app = express();
app.use(express.json()) //procesa la información de tipo json

dotenv.config() //Permite el llamado de las variables de entorno (.env)

conectarBD();

//configurar cors
const whiteList = [process.env.FRONTEND_URL]

const corsOptions = {
    origin: function(origin, callback){
        if(whiteList.includes(origin)) {
            //puede consultar la API
            callback(null, true)
        } else{
            //no puede
            callback(new Error("Error de Cors"))
        }
    }
}

app.use(cors(corsOptions))


//routing
app.use('/api/usuarios', usuarioRoutes) //el use hace referencia a todos los verbos http
app.use('/api/proyectos', proyectoRoutes) 
app.use('/api/tareas', tareaRoutes) 

const PORT = process.env.PORT || 4000;



app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})
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

const servidor = app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})

//socket.io
import { Server } from 'socket.io';

const io = new Server(servidor, {
    pingTimeout : 60000,
    cors : {
        origin: process.env.FRONTEND_URL,
    },
})

io.on('connection', (socket)  =>{
    console.log("Conectado a Socker.io")

    //definir los eventos de socket.io

    //recibimos datos desde react con el evento 'prueba'
    socket.on('prueba', (proyectos)=>{
        console.log('Prueba desde socket.io', proyectos)
    })

    //enviar datos a react
    socket.emit('respuesta', {nombre: 'Juan' , apellido : 'Garcia'})
})
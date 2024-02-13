import express from 'express'
import {
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarProyecto,
    agregarColaborador,
    eliminarColaborador,
    } 
from '../controllers/proyectoController.js'
import checkAuth from '../middleware/checkAuth.js'

const router = express.Router();

router.get('/', checkAuth , obtenerProyectos)
router.post('/', checkAuth , nuevoProyecto)

router.route('/:id').get(checkAuth, obtenerProyecto).put(checkAuth,editarProyecto).delete(checkAuth, eliminarProyecto)

router.post('/agregar-coladorador/:id', checkAuth, agregarColaborador)
router.post('/eliminar-coladorador/:id', checkAuth, eliminarColaborador)

export default router


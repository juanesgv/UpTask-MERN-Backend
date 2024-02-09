import express from 'express'

const router = express.Router()

import {registrarUsuario } from '../controllers/usuarioController.js'

//Autenticación, registro y confirmación de usuario
router.post('/', registrarUsuario)


export default router
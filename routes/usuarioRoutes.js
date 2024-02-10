import express from 'express'

const router = express.Router()

import {registrarUsuario, autenticar, confirmar } from '../controllers/usuarioController.js'

//Autenticación, registro y confirmación de usuario
router.post('/', registrarUsuario)
router.post('/login', autenticar)
router.get('/confirmar/:token', confirmar)


export default router
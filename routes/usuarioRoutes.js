import express from 'express'

const router = express.Router()

import {registrarUsuario, autenticar } from '../controllers/usuarioController.js'

//Autenticación, registro y confirmación de usuario
router.post('/', registrarUsuario)
router.post('/login', autenticar)


export default router
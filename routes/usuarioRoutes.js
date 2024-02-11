import express from 'express'

const router = express.Router()

import {registrarUsuario, autenticar, confirmar, olvidePassword, comprobarToken, nuevoPassword, perfil } from '../controllers/usuarioController.js'
import checkAuth from '../middleware/checkAuth.js'

//Autenticación, registro y confirmación de usuario
router.post('/', registrarUsuario)
router.post('/login', autenticar)
router.get('/confirmar/:token', confirmar)
router.post('/olvide-password', olvidePassword)
router.get('/olvide-password/:token', comprobarToken)
router.post('/olvide-password/:token', nuevoPassword)
//otra forma de hacer routing cuando la ruta es la misma pero tiene diferentes verbos
// router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword)

router.get('/perfil', checkAuth, perfil)


export default router
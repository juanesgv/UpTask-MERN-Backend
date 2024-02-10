import Usuario from "../model/Usuario.js"
import generarId from "../helpers/generarId.js"
import generarJWT from "../helpers/generarJWT.js"

const registrarUsuario = async (req, res) => {
    //Evitar registro duplicados
 
    const {email} = req.body
    const existeUsuario = await Usuario.findOne({email})

    if(existeUsuario){
        const error = new Error('El usuario ya está registrado');
        return res.status(400).json({msg: error.message})
    }

    try {
        const usuario = new Usuario(req.body)
        usuario.token = generarId()
        const usuarioAlmacenado = await usuario.save()
        res.json(usuarioAlmacenado)
    } catch (error) {
        console.log(error)
    }
}

const autenticar = async (req,res) => {

    const  {email, password} = req.body

    //comprobar si el usuario existe
    const usuario = await Usuario.findOne({
        email
    })
    if(!usuario){
        const error = new Error('No se encontró el usuario')
        return res.status(404).json({msg: error.message})
    }
    //comprobar si el usuario está confirmado
    if(!usuario.confirmado){
        const error = new Error('Tu cuenta no ha sido confirmada')
        return res.status(403).json({msg: error.message})
    }

    //Comprobar el password
    if(await usuario.comprobarPassword(password)){
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id)
        })
    }else{
        const error = new Error('La contraseña es incorrecta')
        return res.status(403).json({msg: error.message})
    }
}

//confirmar usuario
const confirmar = async (req, res) => {
    // console.log(req.params.token) //params es el parametro que definite en la ruta /confirmar/:token
    const {token} = req.params
    const confirmarUsuario = await Usuario.findOne({token})
    if (!confirmarUsuario){ 
        const error = new Error('Token no válido')
        return res.status(403).json({msg: error.message})
    }

    try {
        confirmarUsuario.confirmado = true
        confirmarUsuario.token = '';
        await confirmarUsuario.save()
        res.json({msg : 'Usuario confirmado correctamente'})
    } catch (error) {
        console.log(error)
    }
    
}

export {
    registrarUsuario,
    autenticar,
    confirmar
}
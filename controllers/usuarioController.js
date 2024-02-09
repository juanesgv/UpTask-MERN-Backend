import Usuario from "../model/Usuario.js"

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
        const usuarioAlmacenado = await usuario.save()
        res.json(usuarioAlmacenado)
    } catch (error) {
        console.log(error)
    }
}

export {
    registrarUsuario
}
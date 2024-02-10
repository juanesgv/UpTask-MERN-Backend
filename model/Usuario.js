import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const usuarioSchema = mongoose.Schema({
    nombre:{
        type: String,
        require : true,
        trim: true
    },
    password: {
        type: String,
        require : true,
        trim: true
    },
    email: {
        type: String,
        require : true,
        trim: true,
        unique: true
    },
    token : {
        type: String
    },
    confirmado : {
        type: Boolean,
        default: false
    }
},{
    timestamps:true
})

//Hasheo al password
usuarioSchema.pre('save', async function(next){
    if(!this.isModified('password')){ //Verifica si la contraseña ha sido hasheada, si ya ha sido modificada no se ejecuta el hasheo
        next()
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
})

//Comprobación de contraseña
usuarioSchema.methods.comprobarPassword = async function(passwordForm) {
    return await bcrypt.compare(passwordForm, this.password) //retorna true o false
}

const Usuario = mongoose.model("Usuario", usuarioSchema)

export default Usuario
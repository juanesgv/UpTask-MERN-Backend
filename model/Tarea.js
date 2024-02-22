import mongoose from "mongoose";

const tareaSchema = mongoose.Schema({
    nombre: {
        type: String,
        trim: true,
        requiered: true
    },
    descripcion: {
        type: String,
        trim: true,
        requiered: true
    },
    estado: {
        type: Boolean,
        default: false
    },
    fechaEntrega: {
        type: Date,
        requiered: true,
        default: Date.now()
    },
    prioridad: {
        type: String,
        requiered: true,
        enum: ["Baja", "Media", "Alta"]
    },
    proyecto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Proyecto"
    },
    completado :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario"
    }
}, {
    timestamps: true
})

const Tarea = mongoose.model('Tarea', tareaSchema)
export default Tarea
import Proyecto from "../model/Proyecto.js";
import Tarea from "../model/Tarea.js";

const agregarTarea = async (req, res) => {
  //verificar si el proyecto de la petición existe
  const { proyecto } = req.body;
  const existeProyecto = await Proyecto.findById(proyecto);
  if (!existeProyecto) {
    const error = new Error("No existe el proyecto");
    return res.status(404).json({ msg: error.message });
  }

  if (existeProyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("No tienes los permisos para añadir tareas");
    return res.status(403).json({ msg: error.message });
  }

  try {
    const tareaAlmacenada = await Tarea.create(req.body);
    //Almacenar el ID en el proyecto
    existeProyecto.tareas.push(tareaAlmacenada._id)
    await existeProyecto.save()
    res.json(tareaAlmacenada);
  } catch (error) {
    console.log(error);
  }
};

const obtenerTarea = async (req, res) => {
  try {
    const { id } = req.params;

    const tarea = await Tarea.findById(id).populate("proyecto"); //populate "cruza" tareas y proyectos y ambos documentos se muestran en la misma consulta

    //verifica si la tarea existe
    if (!tarea) {
      const error = new Error("No existe el proyecto");
      return res.status(404).json({ msg: error.message });
    }

    //verifica si el creador del proyecto es el autenticado
    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
      const error = new Error("Acción no válida");
      return res.status(403).json({ msg: error.message });
    }

    res.json(tarea);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: "Error interno del servidor", error: error.message });
  }
};

const actualizarTarea = async (req, res) => {
  const { id } = req.params;

  const tarea = await Tarea.findById(id).populate("proyecto");

  //verifica si la tarea existe
  if (!tarea) {
    const error = new Error("No existe el proyecto");
    return res.status(404).json({ msg: error.message });
  }

  //verifica si el creador del proyecto es el autenticado
  if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción no válida");
    return res.status(403).json({ msg: error.message });
  }

  tarea.nombre = req.body.nombre || tarea.nombre;
  tarea.descripcion = req.body.descripcion || tarea.descripcion;
  tarea.prioridad = req.body.prioridad || tarea.prioridad;
  tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega;

  try {
    const tareaAlmacenada = await tarea.save();
    res.json(tareaAlmacenada);
  } catch (error) {
    console.log(error);
  }
};

const eliminarTarea = async (req, res) => {
  const { id } = req.params;

  const tarea = await Tarea.findById(id).populate("proyecto");

  if (!tarea) {
    const error = new Error("No existe el proyecto");
    return res.status(404).json({ msg: error.message });
  }

  if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción no válida");
    return res.status(403).json({ msg: error.message });
  }

  try {
    const proyecto = await Proyecto.findById(tarea.proyecto) 
    proyecto.tareas.pull(tarea._id) //sacar la tarea del proyecto

    await Promise.allSettled([await proyecto.save(), await tarea.deleteOne()]) //se actualiza el proyecto y se elimina la tarea en paralelo

    res.json({msg:"Tarea eliminada existosamente"});
  } catch (error) {
    console.log(error);
  }
};

const cambiarEstado = async (req, res) => {
  const { id } = req.params;

  const tarea = await Tarea.findById(id).populate("proyecto");

  if (!tarea) {
    const error = new Error("No existe el proyecto");
    return res.status(404).json({ msg: error.message });
  }

  if (tarea.proyecto.creador.toString() !== req.usuario._id.toString() && !tarea.proyecto.colaboradores.some(colaborador => colaborador._id.toString() === req.usuario._id.toString())) {
    const error = new Error("Acción no válida");
    return res.status(403).json({ msg: error.message });
  }

  tarea.estado = !tarea.estado;
  tarea.completado = req.usuario._id
  await tarea.save()

  const tareaAlmacenada = await Tarea.findById(id).populate("proyecto").populate('completado'); //despues de actualizar el estado hago una nueva consulta para actualizar el usuario que actualizó

  res.json(tareaAlmacenada)
};

export {
  agregarTarea,
  obtenerTarea,
  actualizarTarea,
  eliminarTarea,
  cambiarEstado,
};

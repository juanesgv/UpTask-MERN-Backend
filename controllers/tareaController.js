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

const actualizarTarea = async (req, res) => {};

const eliminarTarea = async (req, res) => {};

const cambiarEstado = async (req, res) => {};

export {
  agregarTarea,
  obtenerTarea,
  actualizarTarea,
  eliminarTarea,
  cambiarEstado,
};

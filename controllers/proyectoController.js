import express from "express";
import Proyecto from "../model/Proyecto.js";
import Tarea from "../model/Tarea.js";

const obtenerProyectos = async (req, res) => {
  const proyecto = await Proyecto.find().where("creador").equals(req.usuario); //req.usuario es el usuario autenticado que es validado en el middleware
  res.json(proyecto);
};

const nuevoProyecto = async (req, res) => {
  const proyecto = new Proyecto(req.body);
  proyecto.creador = req.usuario._id;

  try {
    const proyectoAlmacenado = await proyecto.save();
    res.json(proyectoAlmacenado);
  } catch (error) {
    console.log(error);
  }
};

const obtenerProyecto = async (req, res) => {
  try {
    const { id } = req.params;
    const proyecto = await Proyecto.findById(id);

    //verifica si el proyecto existe
    if (!proyecto) {
      const error = new Error("No se encontró el proyecto");
      return res.status(404).json({ msg: error.message });
    }

    //verifica si el usuario autenticado es el creador del proyecto
    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
      const error = new Error("Acción no válida");
      return res.status(401).json({ msg: error.message });
    }

     //Obtener las tareas del proyecto
     const tareas = await Tarea.find().where("proyecto").equals(proyecto._id)
     res.json({
      proyecto,
      tareas
     })

  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ msg: "Error interno del servidor", error: error.message });
  }
};

const editarProyecto = async (req, res) => {
  const { id } = req.params;
  const proyecto = await Proyecto.findById(id);

  //verifica si el proyecto existe
  if (!proyecto) {
    const error = new Error("No se encontró el proyecto");
    return res.status(404).json({ msg: error.message });
  }

  //verifica si el usuario autenticado es el creador del proyecto
  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción no válida");
    return res.status(401).json({ msg: error.message });
  }

  proyecto.nombre = req.body.nombre || proyecto.nombre;
  proyecto.descripcion = req.body.descripcion || proyecto.descripcion;
  proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega;
  proyecto.cliente = req.body.cliente || proyecto.cliente;

  try {
    const proyectoAlmacenado = await proyecto.save();
    return res.json(proyectoAlmacenado);
  } catch (error) {
    console.log(error);
  }
};

const eliminarProyecto = async (req, res) => {
  const { id } = req.params;
  const proyecto = await Proyecto.findById(id);

  //verifica si el proyecto existe
  if (!proyecto) {
    const error = new Error("No se encontró el proyecto");
    return res.status(404).json({ msg: error.message });
  }

  //verifica si el usuario autenticado es el creador del proyecto
  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción no válida");
    return res.status(401).json({ msg: error.message });
  }

  try {
    await proyecto.deleteOne()
    res.json({msg:"Proyecto eliminado existosamente"})
  } catch (error) {
    console.log(error)
  }
};

const agregarColaborador = async (req, res) => {};

const eliminarColaborador = async (req, res) => {};


export {
  obtenerProyectos,
  nuevoProyecto,
  obtenerProyecto,
  editarProyecto,
  eliminarProyecto,
  agregarColaborador,
  eliminarColaborador,
};

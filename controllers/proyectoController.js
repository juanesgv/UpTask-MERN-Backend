import express from "express";
import Proyecto from "../model/Proyecto.js";
import Usuario from "../model/Usuario.js";

const obtenerProyectos = async (req, res) => {
  const proyecto = await Proyecto.find({
    '$or' : [
      {'colaboradores' : {$in:req.usuario}}, //req.usuario es el usuario autenticado que es validado en el middleware
      {'creador' : {$in:req.usuario}},
    ]
  })    
    .select("-tareas");
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
    const proyecto = await Proyecto.findById(id)
      .populate("tareas")
      .populate("colaboradores", "nombre email _id");

    //verifica si el proyecto existe
    if (!proyecto) {
      const error = new Error("No se encontró el proyecto");
      return res.status(404).json({ msg: error.message });
    }

    //verifica si el usuario autenticado es el creador del proyecto o colaborador el proyecto
    if (proyecto.creador.toString() !== req.usuario._id.toString() && !proyecto.colaboradores.some(colaborador => colaborador._id.toString() === req.usuario._id.toString())) {
      const error = new Error("Acción no válida");
      return res.status(401).json({ msg: error.message });
    }

    res.json(proyecto);
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
    await proyecto.deleteOne();
    res.json({ msg: "Proyecto eliminado existosamente" });
  } catch (error) {
    console.log(error);
  }
};

const buscarColaborador = async (req, res) => {
  const { email } = req.body;

  const usuario = await Usuario.findOne({ email }).select(
    "-confirmado -createdAt -updatedAt -password -token -__v"
  );

  if (!usuario) {
    const error = new Error("Usuario no encontrado");
    return res.status(404).json({ msg: error.message });
  }
  res.json(usuario);
};

const agregarColaborador = async (req, res) => {
  const { id } = req.params;
  const proyecto = await Proyecto.findById(id);

  if (!proyecto) {
    const error = new Error("Proyecto no encontrado");
    return res.status(404).json({ msg: error.message });
  }

  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción no válida");
    return res.status(404).json({ msg: error.message });
  }

  const { email } = req.body;

  const usuario = await Usuario.findOne({ email }).select(
    "-confirmado -createdAt -updatedAt -password -token -__v"
  );

  if (!usuario) {
    const error = new Error("Usuario no encontrado");
    return res.status(404).json({ msg: error.message });
  }

  //el colaborador no es el admin del proyecto
  if (proyecto.creador.toString() === usuario._id.toString()) {
    const error = new Error("El creador del proyecto no puede ser colaborador");
    return res.status(404).json({ msg: error.message });
  }

  //revisar que no está agregado al proyecto
  if (proyecto.colaboradores.includes(usuario._id)) {
    const error = new Error("El colaborador ya pertenece al proyecto");
    return res.status(404).json({ msg: error.message });
  }

  proyecto.colaboradores.push(usuario._id);
  await proyecto.save();
  return res.json({ msg: "Colaborador agregado exitosamente" });
};

const eliminarColaborador = async (req, res) => {
  const { id } = req.params;
  const proyecto = await Proyecto.findById(id);

  if (!proyecto) {
    const error = new Error("Proyecto no encontrado");
    return res.status(404).json({ msg: error.message });
  }

  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción no válida");
    return res.status(404).json({ msg: error.message });
  }

  proyecto.colaboradores.pull(req.body.id);
  await proyecto.save();
  return res.json({ msg: "Colaborador eliminado del proyecto exitosamente" });

};

export {
  obtenerProyectos,
  nuevoProyecto,
  obtenerProyecto,
  editarProyecto,
  eliminarProyecto,
  buscarColaborador,
  agregarColaborador,
  eliminarColaborador,
};

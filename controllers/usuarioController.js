import Usuario from "../model/Usuario.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import { emailRegistro, emailOlvidePassword } from "../helpers/emails.js";

const registrarUsuario = async (req, res) => {
  //Evitar registro duplicados

  const { email } = req.body;
  const existeUsuario = await Usuario.findOne({ email });

  if (existeUsuario) {
    const error = new Error("El usuario ya está registrado");
    return res.status(400).json({ msg: error.message });
  }

  try {
    const usuario = new Usuario(req.body);
    usuario.token = generarId();
    await usuario.save();

    //enviar el mail de confirmacion
    emailRegistro({
      email: usuario.email,
      nombre: usuario.nombre,
      token: usuario.token,
    });

    res.json({
      msg: "Usuario creado exitosamente, hemos enviado un correo electrónico para que verifiques tu cuenta",
    });
  } catch (error) {
    console.log(error);
  }
};

const autenticar = async (req, res) => {
  const { email, password } = req.body;

  //comprobar si el usuario existe
  const usuario = await Usuario.findOne({
    email,
  });
  if (!usuario) {
    const error = new Error("No se encontró el usuario");
    return res.status(404).json({ msg: error.message });
  }
  //comprobar si el usuario está confirmado
  if (!usuario.confirmado) {
    const error = new Error("Tu cuenta no ha sido confirmada");
    return res.status(403).json({ msg: error.message });
  }

  //Comprobar el password
  if (await usuario.comprobarPassword(password)) {
    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: generarJWT(usuario._id),
    });
  } else {
    const error = new Error("La contraseña es incorrecta");
    return res.status(403).json({ msg: error.message });
  }
};

//confirmar usuario
const confirmar = async (req, res) => {
  const { token } = req.params;

  try {
    const confirmarUsuario = await Usuario.findOne({ token });

    if (!confirmarUsuario) {
      // const error = new Error("El token no es válido o ya ha sido utilizado para confirmar la cuenta.");
      return res
        .status(403)
        .json({
          msg: "El token no es válido o ya ha sido utilizado para confirmar la cuenta.",
        });
    }

    confirmarUsuario.confirmado = true;
    confirmarUsuario.token = "";
    await confirmarUsuario.save();

    res.json({ msg: "Usuario confirmado correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
};

const olvidePassword = async (req, res) => {
  //verificar si el usuario existe
  const { email } = req.body;
  const usuario = await Usuario.findOne({
    email,
  });
  if (!usuario) {
    const error = new Error("No se encontró el usuario");
    return res.status(404).json({ msg: error.message });
  }

  try {
    usuario.token = generarId();
    await usuario.save();

    //enviar mail
    emailOlvidePassword({
      email: usuario.email,
      nombre: usuario.nombre,
      token: usuario.token,
    })

    res.json({
      msg: "Hemos enviado un correo electrónico que contiene las instrucciones para recuperar tu contraseña",
    });
  } catch (error) {
    console.log(error);
  }
};

const comprobarToken = async (req, res) => {
  const { token } = req.params;
  const tokenValido = await Usuario.findOne({
    token,
  });
  if (tokenValido) {
    res.json({ msg: "Token válido y el usuario existe" });
  } else {
    const error = new Error("Token no válido");
    return res.status(404).json({ msg: error.message });
  }
};

const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const usuario = await Usuario.findOne({
    token,
  });
  if (usuario) {
    usuario.password = password;
    usuario.token = "";
    try {
      await usuario.save();
      res.json({ msg: "La contraseña ha sido modificada exitosamente" });
    } catch (error) {
      console.log(error);
    }
  } else {
    const error = new Error("Token no válido");
    return res.status(404).json({ msg: error.message });
  }
};

const perfil = async (req, res) => {
  const { usuario } = req;
  res.json(usuario);
};

export {
  registrarUsuario,
  autenticar,
  confirmar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  perfil,
};

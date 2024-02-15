import nodemailer from "nodemailer";

export const emailRegistro = async (datos) => {
  const { email, nombre, token } = datos;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT ,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  //Información del email
  const info = await transport.sendMail({
    from: '"UpTask - Administrador de proyectos" <cuentas@uptask.com>',
    to: email,
    subject: "UpTask - Confirma tu cuenta",
    text: "Comprueba tu cuenta en UpTask",
    html: `
        <p>Hola ${nombre} comprueba tu cuenta en UpTask</p>
        <p>Tu cuenta ya está casi lista, solo debes comprobarla en el siguiente enlace:</p>
        <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar cuenta</a>
        <p>Si no creaste esta cuenta, puedes ignorar el mensaje</p>
    `,
  });
};
export const emailOlvidePassword = async (datos) => {
  const { email, nombre, token } = datos;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT ,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  //Información del email
  const info = await transport.sendMail({
    from: '"UpTask - Administrador de proyectos" <cuentas@uptask.com>',
    to: email,
    subject: "UpTask - Reestablece tu contraseña",
    text: "Comprueba tu cuenta en UpTask",
    html: `
        <p>Hola ${nombre} has solicitado reestablecer tu contraseña</p>
        <p>Sigue el siguiente enlace para generar la nueva contraseña:</p>
        <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer contraseña</a>
        <p>Si no solicitaste reestablecer tu contraseña, puedes ignorar el mensaje</p>
    `,
  });
};

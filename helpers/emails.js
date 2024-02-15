import nodemailer from "nodemailer";

export const emailRegistro = async (datos) => {
  const { email, nombre, token } = datos;

  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "e44a235a60d9c0",
      pass: "2171eea1287b5e",
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
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "e44a235a60d9c0",
      pass: "2171eea1287b5e",
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

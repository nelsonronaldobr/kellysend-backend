import sgMail from "@sendgrid/mail";
import { config } from "dotenv";

config()

sgMail.setApiKey(process.env.SENDGRID_KEY)


export const emailRegister = async ({ email, name, token }) => {


    //! informacion del email

    try {
        const info = await sgMail.send({
            from: 'nelsonbr862@gmail.com',
            to: email,
            subject: "KellySend - Confirma tu cuenta",
            text: "Comprueba tu cuenta en KellySend",
            html: `
            <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8" />
            <title>Kelly Send</title>
            <style>
                    .body {
                        font-family: Arial, sans-serif;
                        color: #333;
                        font-size: 16px;
                        line-height: 1.5;
                        text-align: justify;
                        height: 100vh;
                        padding: 30px;
                        margin: 0 auto;
                        width: 70%;
                        max-witdh: 450px;
                        min-witdh: 300px;
                        background-color: #f3f4f6;
                    }
                    .p{
                        margin:10px 0;
                        padding:0;
                        color: #51545e;
                    }
                    .h1 {
                        color: #000;
                        font-size: 20px;
                        font-weight: bold;
                        margin: 0;
                        padding: 10px 0;
                        text-align: center;
                    }
                    .text{
                        color: #f43f5e;
                        text-decoration: none;
                    }
                    .btn {
                        border-radius: 4px;
                        color: #fff;
                        display: inline-block;
                        font-size: 16px;
                        font-weight: bold;
                        margin: 0;
                        padding: 10px 20px;
                        text-decoration: none;
                        background-color:#f43f5e;
                    }
                    .container{
                        background-color: #fff;
                        padding: 25px 35px;
                    }
                    .msg-5925850309400592997 .m_-5925850309400592997body {
                        height: 100% !important;
                    }
                    .copyright{
                        font-size: 12px;
                        text-align: center;
                    }
            </style>
            </head>
            <body class="body" style="height: 100% !important;">
                <div class="container" style="height: 100% !important;">
                    <div style="display:flex;justify-content:center;align-items:center;">
                        <img style="width:200px;margin: 0 auto;" src="https://scontent.flim16-2.fna.fbcdn.net/v/t1.15752-9/344291030_182749470995851_5341673754342222279_n.png?_nc_cat=106&ccb=1-7&_nc_sid=ae9488&_nc_ohc=KE4D_IqCOMgAX8frdJp&_nc_ht=scontent.flim16-2.fna&oh=03_AdSj0QTSiYpfEzrplUfxLJKk3gbD-2ENdqPH9MnlN5cU-g&oe=648E4FF7">
                    </div>
                    <h1 class="h1">Confirma tu cuenta en KellySend</h1>
                    <p class="p">Hola ${name}, gracias por registrarte en nuestro servicio. Para completar tu registro, haz clic en el siguiente enlace:</p>
                    <div style="text-align: center; padding: 20px 0;">
                        <a href="${process.env.FRONTEND_URL}/confirm-account/${token}" class="btn text" style="color: #fff;">Confirmar cuenta</a>
                    </div>
                    <p class="p">Si tienes algún problema con el botón, puedes copiar y pegar el siguiente enlace en tu navegador:</p>
                    <div style="color: #f43f5e;text-decoration: none;">${process.env.FRONTEND_URL}/confirm-account/${token}</div>
                    <p class="p">Si no solicitaste confirmar tu cuenta, por favor ignore este correo electrónico.</p>
                </div>
                <p class="copyright">© KellySend Inc. 2023 Lima Street, Perú</p>
            </body>
            </html>
            `,
            mailSettings: {
                sandboxMode: {
                    enable: false
                }
            }

        })
    } catch (error) {
        console.log(error);
    }
}

/* const emailRegister = async ({ email, name, token }) => {

    const transport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'nelsonbr862@gmail.com',
            pass: 'lyugwwxthldjnjpg'
        }
    });

    //! informacion del email

    const info = await transport.sendMail({
        from: '"KellySend - Comparte archivos"',
        to: email,
        subject: "KellySend - Confirma tu cuenta",
        text: "Comprueba tu cuenta en KellySend",
        html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Kelly Send</title>
            <style>
                    .body {
                        font-family: Arial, sans-serif;
                        color: #333;
                        font-size: 16px;
                        line-height: 1.5;
                        text-align: justify;
                        height: 100vh;
                        padding: 30px;
                        margin: 0 auto;
                        width: 65%;
                        max-witdh: 450px;
                        min-witdh: 300px;
                    }
                    .p{
                        margin:10px 0;
                        padding:0;
                        color: #51545e;
                    }
                    .h1 {
                        color: #000;
                        font-size: 20px;
                        font-weight: bold;
                        margin: 0;
                        padding: 10px 0;
                        text-align: center;
                    }
                    .text{
                        color: #f43f5e;
                        text-decoration: none;
                    }
                    .btn {
                        border-radius: 4px;
                        color: #fff;
                        display: inline-block;
                        font-size: 16px;
                        font-weight: bold;
                        margin: 0;
                        padding: 10px 20px;
                        text-decoration: none;
                        background-color:#f43f5e;
                    }
            </style>
            </head>
            <body class="body">
                <div style="display:flex;justify-content:center;align-items:center;">
                    <img style="width:230px;margin: 0 auto;" src="https://scontent.flim16-2.fna.fbcdn.net/v/t1.15752-9/344291030_182749470995851_5341673754342222279_n.png?_nc_cat=106&ccb=1-7&_nc_sid=ae9488&_nc_ohc=KE4D_IqCOMgAX8frdJp&_nc_ht=scontent.flim16-2.fna&oh=03_AdSj0QTSiYpfEzrplUfxLJKk3gbD-2ENdqPH9MnlN5cU-g&oe=648E4FF7">
                </div>
                <h1 class="h1">Confirma tu cuenta en KellySend</h1>
                <p class="p">Hola ${name}, gracias por registrarte en nuestro servicio. Para completar tu registro, haz clic en el siguiente enlace:</p>
                <div style="text-align: center; padding: 20px 0;">
                    <a href="${process.env.FRONTEND_URL}/confirm-account/${token}" class="btn text" style="color: #fff;">Confirmar cuenta</a>
                </div>
                <p class="p">Si tienes algún problema con el botón, puedes copiar y pegar el siguiente enlace en tu navegador:</p>
                <div style="color: #f43f5e;text-decoration: none;">${process.env.FRONTEND_URL}/confirm-account/${token}</div>
                <p class="p">Si no solicitaste confirmar tu cuenta, por favor ignore este correo electrónico.</p>
            </body>
            </html>
        `,
    })
}
 */

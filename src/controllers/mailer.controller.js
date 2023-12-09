import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user:'ericnegreidooo@gmail.com',
        pass:'ozopmzysnlddgcbn'
    }

});

const sendMail = async (req, res) =>{
    const {content, email} = req.body;
    try {
        await transporter.sendMail({
            from: 'AppCoder',
            to: email,
            subject: 'TICKET DE COMPRA',
            html: content
        });
    res.send('Correo enviado');

    } catch (error) {
        console.error('Error al enviar el correo electrónico:', error);
        throw error
    }
    

}

export default sendMail
import transporter from '../../config/nodemailer.js'

//for send otp
const sendEmail = (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Verification mail",
        text: `For verification. ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(`Error: ${error}`);
        } else {
            console.log(`Email sent: ${info.response}`);
        }
    });
}

export default sendEmail;
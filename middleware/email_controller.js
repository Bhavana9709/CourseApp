const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'bhavanamodepalli09@gmail.com',
        pass: '9662123020'
    }
});
exports.send_email_message = (send_to, subject, message) => {

    // return new Promise((resolve, reject) => {

    var mailOptions = {
        from: 'bhavanamodepalli09@gmail.com',
        to: send_to,
        subject: subject,
        text: message
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    // });

}
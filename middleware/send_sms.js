const accountSid = "ACfbd3fba62e9032f19ba8e7cc4ea91cad";
const authToken = "e881b289b6022af98f77f08b42d6c2be";
const client = require('twilio')(accountSid, authToken);

exports.send_sms = (send_to, message) => {
    client.messages
        .create({
            body: message,
            from: '+19794014861',
            to: send_to
        })
        .then(message => console.log(message));
};

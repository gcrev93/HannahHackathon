var nodemailer = require('nodemailer');
//var env = require('./env.js');
 
var smtpConfig = {
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false,
    tls:{
        ciphers:'SSLv3'
    },
    auth: {
        user: 'gcrev93@hotmail.com',
        pass: 'gwashT27'
    }
};
// create reusable transporter object using the default SMTP transport 
var transporter = nodemailer.createTransport(smtpConfig);
 
// send mail with defined transport object 
exports.SendMail = function(email, code){
    var mailOptions = {
    from: '"Gabby " <gcrev93@hotmail.com>', // sender address 
    to: email, // list of receivers 
    subject: 'Your Azure Code', // Subject line 
    text: 'Hello fellow hacker!', // plaintext body 
    html: '<p>Hello fellow hacker!<p><p>Thank you for signing up for an Azure Code! We hope that our services can truly help you with your project. Here is your Azure code: </p><p> <b>' + code + '</b></p><p> To activate: Go to http://www.microsoftazurepass.com/ and paste in this number</p><p> Please come by the booth if you have any questions and dont forget to fill out oursurvey at https://aka.ms/calhacks for a chance to win a Xbox one, GoPro Hero 3+ White with headstrap and quickclip, or a 10 min massage!</p></br><p><h3>Gabrielle Crevecoeur</h3></p><p>Audience Technical Evangelist – US</p><p>E: gacreve@microsoft.com</p><p><img src="http://blogs.microsoft.com/wp-content/uploads/2012/08/8867.Microsoft_5F00_Logo_2D00_for_2D00_screen.jpg" style="width: 20%; height: 20%"></p>' // html body 
};
    transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
});
}


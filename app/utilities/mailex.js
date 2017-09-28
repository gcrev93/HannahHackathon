require('dotenv').load()
var nodemailer = require('nodemailer')
var hackData = require('../../data/hackSpecificData')

var smtpConfig = {
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false,
  tls: {
    ciphers: 'SSLv3'
  },
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASS
  }
}
// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport(smtpConfig)

// send mail with defined transport object
exports.SendMail = function (email, code) {
  var mailOptions = {
    from: `"Microsoft Evangelism Team " <${process.env.EMAIL_USERNAME}>`, // sender address
    to: email, // list of receivers
    subject: 'Your Azure Code', // Subject line
    text: 'Hello fellow hacker!', // plaintext body
    html: '<p>Hello fellow hacker!<p><p>Thank you for signing up for an Azure Code! We hope that our services can truly help you with your project. Here is your Azure code: </p><p> <b>' + code + '</b></p><p> To activate: Go to http://www.microsoftazurepass.com/ and paste in this number</p><p> Please come by the booth if you have any questions and dont forget to fill out our survey at ' + hackData.surveyLink + ' for a chance to win ' + hackData.prize + '!</p></br><p><h3>Microsoft Evangelism Team</h3></p><p> </p><p>E: usdxmsfthack@outlook.com</p>' // html body
  }
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return console.log(error)
    }
    console.log('Message sent: ' + info.response)
  })
}


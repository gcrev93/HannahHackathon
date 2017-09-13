require('dotenv').config()
const restify = require('restify')
const builder = require('botbuilder')
const validator = require('validator')
const hackData = require('./data/hackSpecificData')
const table = require('./app/utilities/tableStorage')
const createCard = require('./app/utilities/createCard')

const techhelp = ['Unity', 'Xamarin', 'Azure', 'Hardware', 'IoT', 'Hololens', 'Cognitive Services', 'ChatBots', 'Other']

// Setup Restify Server
const server = restify.createServer()
server.listen(process.env.port || process.env.PORT || 3978, function () {
  console.log('%s listening to %s', server.name, server.url)
})

// Create chat bot
const connector = new builder.ChatConnector({
  appId: process.env.APP_ID,
  appPassword: process.env.APP_PASS
})

const bot = new builder.UniversalBot(connector)
server.post('/api/messages', connector.listen())

const model = 'https://api.projectoxford.ai/luis/v1/application?id=' + process.env.LUIS_ID + '&subscription-key=' + process.env.LUIS_KEY + '&verbose=true'
const recognizer = new builder.LuisRecognizer(model)
const dialog = new builder.IntentDialog({recognizers: [recognizer]})
bot.dialog('/', dialog)

// =========================================================
// Bots Dialogs
// =========================================================

// TODO: Refactor this into a string store somewhere instead of a separate function call
function sendGreet (session) {
  session.send('I can help you get an Azure Code, find resources, or connect you with our Microsoft team! What would you like help with?')
}

// TODO: Use trigger actions to match intents instead of this pattern
dialog.matches('None', [
  function (session, args, next) {
    if (args.text === 'no') {
    } else {
      session.send("I'm sorry, I didn't understand that..")
      sendGreet(session)
    }
  }
])

dialog.matches('negativeComment', [
  function (session, args, next) {
    session.send("That's not very nice.. If you come by the booth we can help you out in person!")
  }
])

dialog.matches('profanity', [
  function (session, args, next) {
    session.send('Hey! Watch it!')
  }
])

dialog.matches('azureCodeError', [
  function (session, args, next) {
    session.send("Oh no! We're sorry to hear that. Please try again - I will hand you a new code.")
  }
])

dialog.matches('greeting', [
  function (session, args, next) {
    session.send('Hello there!')
    sendGreet(session)
  }
])

dialog.matches('teamInfo', [
  function (session, args, next) {
    // create the card based on selection
    const card = createCard(session)

    // attach the card to the reply message
    const msg = new builder.Message(session).addAttachment(card)
    session.send(msg)
    session.send('Come stop by the booth and meet our team! We can help you out with your projects and bounce ideas around... or just hang out :)')
  }
])

dialog.matches('endConvo', [
  function (session, args, next) {
    session.send('Let me know if you need something else!')
  }
])

dialog.matches('botHelp', [
  function (session, args, next) {
    sendGreet(session)
  }
])

dialog.matches('techHelp', [
  function (session, args, next) {
    builder.Prompts.choice(session, 'Which technology do you need help with? (Choose a number)', techhelp)
  },
  function (session, results) {
    console.log(results.response)
    switch (results.response.index) {
      case 0:
        session.send('To get started with Unity, check out the documentation at https://docs.unity3d.com/Manual/index.html . You can also find some of their tutorials at https://unity3d.com/learn/tutorials. Our very own Gavin can also help you. See if you can find him at the booth')
        break
      case 1:
        session.send('You can find a lot of great Xamarin resources at https://developer.xamarin.com/. You can also ask for Gavin or David G. at our booth and he can help')
        break
      case 2:
        session.send('Feel free to head to the booth to find an Azure expert, but here are some Azure docs. For Azure App Services, head over to this link: https://docs.microsoft.com/en-us/azure/app-service/ . For Azure Storage check out https://docs.microsoft.com/en-us/azure/storage/ . And for Azure Mobile Apps head over to https://docs.microsoft.com/en-us/azure/app-service-mobile/app-service-mobile-android-get-started')
        break
      case 3:
        session.send("If you are looking for help with Hardware boards head to the booth and talk to Rae, Brian, Hao or Kevin :). You can also email usdxmsfthack@outlook.com if you can't immediately find them.")
        break
      case 4:
        session.send('For Azure IoT you can check out https://docs.microsoft.com/en-us/azure/iot-hub/ . You can also ask for Brian at the booth!')
        break
      case 5:
        session.send('If you need help with Hololens, you can talk to Gavin or Brian at our Microsoft booth. You can also check out the docs at https://developer.microsoft.com/en-us/windows/holographic')
        break
      case 6:
        session.send('For Cognitive Services docs head to https://www.microsoft.com/cognitive-services/en-us/documentation. At the booth Hao, Kevin and David G are great to help you with Cognitive Services! ')
        break
      case 7:
        session.send('You want to know how to build a bot like me? Head to https://docs.botframework.com/en-us/. You can also head to booth where various team members can help you!')
        break
      case 8:
        session.send('If you need help with a technology not on this list, email us at usdxmsfthack@outlook.com so we can find someone to answer your questions.')
        break
      default:
        session.send("If I can't help you with any of your needs you can head to our booth and talk with someone or email the team at usdxmsfthack@outlook.com")

    }
  }
])

dialog.matches('azureCode', [
  function (session, args, next) {
    session.beginDialog('/getInfo')
  }
])

bot.dialog('/getInfo', [
  function (session) {
    session.beginDialog('/name')
  },
  function (session) {
    console.log('endDialog: getInfo')
    session.endDialog()
  }
])

bot.dialog('/name', [
  function (session) {
    builder.Prompts.text(session, 'Ok lets get you set up! What is your full name?')
  },
  function (session, results) {
    session.userData.name = results.response
    session.beginDialog('/email')
  }
])

bot.dialog('/email', [
  function (session) {
    builder.Prompts.text(session, 'What is your email address?')
  },
  function (session, results) {
    if (validator.isEmail(results.response)) {
      session.userData.email = results.response
      session.beginDialog('/school')
    } else {
      session.send('Invalid email')
      session.beginDialog('/email')
    }
  }]
)

bot.dialog('/school', [
  function (session) {
    builder.Prompts.text(session, 'What university do you go to?')
  },
  function (session, results) {
    session.userData.university = results.response
    session.beginDialog('/number')
  }]
)

bot.dialog('/number', [
  function (session) {
    builder.Prompts.text(session, 'What is your phone number?')
  },
  function (session, results) {
    if (validator.isMobilePhone(results.response.replace(/[^0-9]/g, ''), 'en-US')) {
      session.userData.number = results.response
      session.beginDialog('/project')
    } else {
      session.send('Invalid phone number')
      session.beginDialog('/number')
    }
  }]
)

bot.dialog('/project', [
  function (session) {
    builder.Prompts.text(session, "That's Awesome!!! Tell me a little bit about your project! ")
  },
  function (session, results) {
    session.userData.project = results.response
    session.beginDialog('/pass')
  }]
)

bot.dialog('/pass', [
  function (session, args, next) {
    // checks student table to test if email is unique
    // args(callIfUnique, callIfNotUnique, next)
    // TODO get survey for hackillinois and change it in this session.send
    table.getPassOnlyOnUniqueEmail(session, function ifUnique () {
      table.RetrievePass(session, function (session) {
        session.send('Great! Here is your Azure pass: ' + session.userData.code + '. You will also get a confirmation email with your Azure pass. To activate: Go to http://www.microsoftazurepass.com/ and paste in this number and dont forget to fill out our survey ' + hackData.surveyLink + ' for a chance to win ' + hackData.prize + '. Good luck!')
      }, next)
    }, function ifNotUnique (next) {
      session.send('Sorry, it seems you have already signed up for an Azure Code. We can only allow one per student. Happy Hacking :)')
      next()
    }, next)
  },
  function (session, args, next) {
    session.send('Can I help you with anything else?')
    session.endDialog()
  }]
)

server.get(/\/?.*/, restify.serveStatic({
  directory: './public',
  default: 'index.html'
}))

require('dotenv').config()
var restify = require('restify')
var mail = require('./mailex.js')
var builder = require('botbuilder')
var azure = require('azure-storage')
var validator = require('validator')
var survey = 'https://aka.ms/hackillinois'

// =========================================================
// Azure Table Setup
// =========================================================
var tableSvc = azure.createTableService('azurecredits', process.env.AZURE_STORAGE)

// =========================================================
// Bot Setup
// =========================================================

// Setup Restify Server
var server = restify.createServer()
server.listen(process.env.port || process.env.PORT || 3978, function () {
  console.log('%s listening to %s', server.name, server.url)
})

// Create chat bot
var connector = new builder.ChatConnector({
  appId: process.env.APP_ID,
  appPassword: process.env.APP_PASS
})

var bot = new builder.UniversalBot(connector)
server.post('/api/messages', connector.listen())

var model = 'https://api.projectoxford.ai/luis/v1/application?id=' + process.env.LUIS_ID + '&subscription-key=' + process.env.LUIS_KEY + '&verbose=true'
var recognizer = new builder.LuisRecognizer(model)
var dialog = new builder.IntentDialog({recognizers: [recognizer]})
bot.dialog('/', dialog)

// =========================================================
// Bots Dialogs
// =========================================================

function sendGreet (session) {
  session.send('I can help you get an Azure Code, find resources, or connect you with our Microsoft team! What would you like help with?')
}

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
    // // create the card based on selection
    // var card = createCard(session)

    // // attach the card to the reply message
    // var msg = new builder.Message(session).addAttachment(card)
    // session.send(msg)
    session.send('Come stop by the booth and meet our team! We can help you out with your projects and bounce ideas around... or just hang out :)')
  }
])

function createCard (session) {
  return new builder.ReceiptCard(session)
      .title('HackIllinois Microsoft Team')
      .facts([
        builder.Fact.create(session, '', 'Meet the team!')
      ])
      .items([
        builder.ReceiptItem.create(session, '', 'Brian')
          .subtitle('IoT, Azure')
          .quantity(400)
          .image(builder.CardImage.create(session, 'https://media.licdn.com/mpr/mpr/shrinknp_400_400/AAEAAQAAAAAAAAHjAAAAJDA3NjBkMmVkLTg5NWEtNGY2Zi05NGZiLWUxNzBkZGM0NDI3NQ.jpg')),
        builder.ReceiptItem.create(session, '', 'David G.')
          .subtitle('Cognitive Services, Xamarin')
          .quantity(400)
          .image(builder.CardImage.create(session, 'https://media.licdn.com/mpr/mpr/shrinknp_400_400/AAEAAQAAAAAAAAJlAAAAJGZhYmY5ZmFjLTNkODMtNDAzNy1iZmIwLTY4NWE2YjBmYjJiNg.jpg')),
        builder.ReceiptItem.create(session, '', 'David W.')
        .subtitle('Swift, Azure')
          .quantity(400)
          .image(builder.CardImage.create(session, 'https://media.licdn.com/mpr/mpr/shrinknp_400_400/p/4/000/163/067/24292c1.jpg')),
        builder.ReceiptItem.create(session, '', 'Gavin')
          .subtitle('HoloLens, Xamarin')
          .quantity(400)
          .image(builder.CardImage.create(session, 'https://media.licdn.com/mpr/mpr/shrinknp_400_400/p/7/005/092/27e/0ef9945.jpg')),
        builder.ReceiptItem.create(session, '', 'Hao')
          .subtitle('Cognitive Services, JavaScript')
          .quantity(400)
          .image(builder.CardImage.create(session, 'https://media.licdn.com/mpr/mpr/shrinknp_400_400/p/7/005/0ab/34d/355e826.jpg')),
        builder.ReceiptItem.create(session, '', 'Kevin')
          .subtitle('Chatbots, Hardware')
          .quantity(400)
          .image(builder.CardImage.create(session, 'https://media.licdn.com/mpr/mpr/shrinknp_400_400/AAEAAQAAAAAAAAS8AAAAJGQ4NDU0Nzc3LWY2NzUtNDQyOS1iNDBlLWY2NjJhZmE3ZTY2YQ.jpg')),
        builder.ReceiptItem.create(session, '', 'Julie')
          .subtitle('Device Checkout and Prizes')
          .quantity(400)
          .image(builder.CardImage.create(session, 'http://www.meetingsolutionsinc.com/images/staff_julie.jpg')),
        builder.ReceiptItem.create(session, '', 'Milan')
          .subtitle('Azure')
          .quantity(400)
          .image(builder.CardImage.create(session, 'https://media.licdn.com/mpr/mpr/shrinknp_400_400/p/4/005/0aa/117/065db3d.jpg')),
        builder.ReceiptItem.create(session, '', 'Rae')
          .subtitle('Hardware, JavaScript')
          .quantity(400)
          .image(builder.CardImage.create(session, 'https://www.thatconference.com/cloud/profilephotos/Rachel-Weil-085b9794-2be8-40cb-84f0-0539040d088a-635937481751319387.jpg?w=350&h=350&scale=canvas')),
        builder.ReceiptItem.create(session, '', 'Sri')
          .subtitle('Azure')
          .quantity(400)
          .image(builder.CardImage.create(session, 'https://media.licdn.com/mpr/mpr/shrinknp_400_400/AAEAAQAAAAAAAAwfAAAAJDRhMmY2NzdjLTNkMzQtNGZjMC05MTQ2LTI5Y2YyMDdjZjE3NQ.jpg')),
        builder.ReceiptItem.create(session, '', 'Tierney')
          .subtitle('Swag Master')
          .quantity(400)
          .image(builder.CardImage.create(session, 'https://media.licdn.com/mpr/mpr/shrinknp_400_400/AAEAAQAAAAAAAAjSAAAAJDc2ODA4YWI4LTdmZDgtNDRlMy04YmJlLTM4NTdiMDRmZmI4MQ.jpg'))
      ])
}

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
    // Gabby do something here
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
  //
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
    getPassOnlyOnUniqueEmail(session, function ifUnique () {
      RetrievePass(session, function (session) {
        session.send('Great! Here is your Azure pass: ' + session.userData.code + '. You will also get a confirmation email with your Azure pass. To activate: Go to http://www.microsoftazurepass.com/ and paste in this number and dont forget to fill out our survey ' + survey + ' for a chance to win a Xbox one, GoPro Hero 3+ White with headstrap and quickclip, or a 10 min massage. Good luck!')
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

function getPassOnlyOnUniqueEmail (session, ifUnique, ifNotUnique, next) {
  var query = new azure.TableQuery()
    .top(1)
    .where('RowKey eq ?', session.userData.email)

  tableSvc.queryEntities('AzureCreditStudents', query, null, function (error, result, response) {
    if (!error) {
      if (result.entries.length > 0) {
          // If the JSON response is greater than 0 then that means the email does exist
        ifNotUnique(next)
      } else {
          // If JSON response is 0 then the email DOES NOT exist
        ifUnique()
      }
    } else {
      console.log(error)
    }
  })
}

function RetrievePass (session, onQueryFinish, next) {
  var query = new azure.TableQuery()
    .top(1)
    .where('Used eq ?', false)

  tableSvc.queryEntities('AzureCredits', query, null, function (error, result, response) {
    if (!error) {
      session.userData.code = result.entries[0].Code._
      var row = result.entries[0].RowKey._
      UpdateCreditTable(row)
      mail.SendMail(session.userData.email, session.userData.code)
      onQueryFinish(session)
      UpdateStudentTable(session.userData)
    //  next()
    } else {
      console.log(error)
    }
  })
}
function UpdateCreditTable (row) {
  var entGen = azure.TableUtilities.entityGenerator
  var updatedtask = {
    PartitionKey: entGen.String('Credit'),
    RowKey: entGen.String(row),
    Used: true
  }

  tableSvc.mergeEntity('AzureCredits', updatedtask, function (error, result, response) {
    if (!error) {
      console.log('Credit Updated')
    } else {
      console.log(error)
    }
  })
}

function UpdateStudentTable (userData) {
  var entGen = azure.TableUtilities.entityGenerator
  var task = {
    PartitionKey: entGen.String('Student'),
    RowKey: entGen.String(userData.email), // must be unique
    Timestamp: entGen.DateTime(new Date(Date.now())),
    Name: entGen.String(userData.name),
    University: entGen.String(userData.university),
    PhoneNumber: entGen.String(userData.number),
    ProjectDetails: entGen.String(userData.project),
    AzureCode: entGen.String(userData.code)
  }

  tableSvc.insertEntity('AzureCreditStudents', task, function (error, result, response) {
    if (!error) {
      console.log('Student added')
    } else {
      console.log(error)
    }
  })
}

var techhelp = ['Unity', 'Xamarin', 'Azure', 'Hardware', 'IoT', 'Hololens', 'Cognitive Services', 'ChatBots', 'Other']

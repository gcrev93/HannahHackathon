require('dotenv').config()
var restify = require('restify')
var mail = require('./mailex.js')
var builder = require('botbuilder')
var azure = require('azure-storage')
var validator = require('validator')

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
    session.send("I'm sorry, I didn't understand that..")
    sendGreet(session)
  }
])

dialog.matches('greeting', [
  function (session, args, next) {
    session.send('Hello! My name is Hannah.')
    sendGreet(session)
  }
])

dialog.matches('botHelp', [
  function (session, args, next) {
    sendGreet(session)
  }
])

dialog.matches('techHelp', [
  function (session, args, next) {
      // implement button menu
      // unitiy, xamarin, azure, hardware, iot, kinect, hololens, cognitive services, chatbots,

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
    if (validator.isMobilePhone(results.response, 'en-US')) {
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
    // checks student db to test if email is unique
    // args(callIfUnique, callIfNotUnique, next)
    getPassOnlyOnUniqueEmail(function ifUnique () {
      RetrievePass(session, function (session) {
        session.send('Great! Here is your Azure pass: ' + session.userData.code + '. You will also get a confirmation email with your Azure pass. To activate: Go to http://www.microsoftazurepass.com/ and paste in this number and dont forget to fill out our survey at https://aka.ms/calhacks for a chance to win a Xbox one, GoPro Hero 3+ White with headstrap and quickclip, or a 10 min massage. Good luck!')
      }, next)
    }, function ifNotUnique (next) {
      next()
    }, next)
  },
  function (session, args, next) {
    // TODO define what to do if email is NOT unique
  }]
)

function getPassOnlyOnUniqueEmail (ifUnique, ifNotUnique, next) {
  // TODO query student table to check if email is unique
  // if unique
  ifUnique()

  // if not unique
  // ifNotUnique(next)
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
      next()
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

function UpdateStudentTable ({email, name, university, number, project, code}) {
  var entGen = azure.TableUtilities.entityGenerator
  var task = {
    PartitionKey: entGen.String('Student'),
    RowKey: entGen.String(email), // must be unique
    Timestamp: entGen.DateTime(new Date(Date.now())),
    Name: entGen.String(name),
    University: entGen.String(university),
    PhoneNumber: entGen.String(number),
    ProjectDetails: entGen.String(project),
    AzureCode: entGen.String(code)
  }

  tableSvc.insertEntity('AzureCreditStudents', task, function (error, result, response) {
    if (!error) {
      console.log('Student added')
    } else {
      console.log(error)
    }
  })
}

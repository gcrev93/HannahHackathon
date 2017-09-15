require('dotenv').config()
const restify = require('restify')
const builder = require('botbuilder')

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
bot.recognizer(new builder.LuisRecognizer(model))

bot.library(require('./app/dialogs/greeting').createLibrary())
bot.library(require('./app/dialogs/teamInfo').createLibrary())
bot.library(require('./app/dialogs/techHelp').createLibrary())
bot.library(require('./app/dialogs/azureCode').createLibrary())
bot.library(require('./app/dialogs/negativeComment').createLibrary())
bot.library(require('./app/dialogs/profanity').createLibrary())
bot.library(require('./app/dialogs/azureCodeError').createLibrary())
bot.library(require('./app/dialogs/endConvo').createLibrary())
bot.library(require('./app/dialogs/botHelp').createLibrary())
bot.library(require('./app/dialogs/none').createLibrary())

server.get(/\/?.*/, restify.serveStatic({
  directory: './public',
  default: 'index.html'
}))

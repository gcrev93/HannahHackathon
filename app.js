var restify = require('restify');
var builder = require('botbuilder');
var env = require('./env.js');
var azure = require('azure-storage');

var tableSvc = azure.createTableService;

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.APP_ID,
    appPassword: process.env.APP_PASS
});

var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/',

    function (session) {
        session.send("Hello! Welcome to the Azure Credit Bot. Would you an Azure Credit today?")
        session.beginDialog('/name');
    });

bot.dialog('/name', new builder.IntentDialog()
    .matches(/^yes/i, [
        function (session) {

            builder.Prompts.text(session, "Ok lets get you set up! What is your name?")
        },
        function (session, results) {
            // save name to Azure Table
            tableSvc.
            session.beginDialog('/school')
        }])
    .matches(/^no/i, function (session) {
        session.send("Ok see ya later!")
        session.endConversation;
    }));


bot.dialog('/school', [
    function (session) {
        builder.Prompts.text(session, "What university did you go to?");
    },
    function (session, results) {
        // save university name results.response
        builder.Prompts.text(session, "Thats Awesome!!! Tell me a little bit about your project! ")
    },
    function (session, results) {
        // save project name results.response
        session.beginDialog('/pass')
    }]
);

bot.dialog('/pass', [
    function (session) {
        session.send("Great here is your pass: go to http://azurepass.com and paste in this number") //+pass
        // session.send("")
        session.endConversation;
    }]
);


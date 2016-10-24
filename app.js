var restify = require('restify');
var builder = require('botbuilder');
var env = require('./env.js');
var azure = require('azure-storage');

//=========================================================
// Azure Table Setup
//=========================================================
var tableSvc = azure.createTableService("azurecredits", process.env.AZURE_STORAGE);

var name, univ, proj, email, code;

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
        session.send("Hello! Welcome to the Azure Credit Bot. Would you an Azure Credit today? (Yes/No)")
        session.beginDialog('/name');
    });

bot.dialog('/name', new builder.IntentDialog()
    .matches(/^yes/i, [
        function (session) {

            builder.Prompts.text(session, "Ok lets get you set up! What is your name?")
        },
        function (session, results) {
            name = results.response;
            session.beginDialog('/email')
        }])
    .matches(/^no/i, function (session) {
        session.send("Ok see ya later!")
        session.endConversation;
    }));

bot.dialog('/email', [
    function (session) {
        builder.Prompts.text(session, "What is your email address?");
    },
    function (session, results) {
        email = results.response;
        session.beginDialog('/school')
    }]
);

bot.dialog('/school', [
    function (session) {
        builder.Prompts.text(session, "What university did you go to?");
    },
    function (session, results) {
        univ = results.response;
        session.beginDialog('/project')
    }]
);

bot.dialog('/project', [
    function (session) {
        builder.Prompts.text(session, "Thats Awesome!!! Tell me a little bit about your project! ")
    },
    function (session, results) {
        proj = results.response;
        session.beginDialog('/pass')
        UpdateStudentTable();

    }]
);

bot.dialog('/pass', [
    function (session) {
        RetrievePass();
        setTimeout(function(){
            session.send("Great! Here is your Azure pass: " + code + ". Go to http://www.microsoftazurepass.com/ and paste in this number and dont forget to come by the Microsoft booth and fill out our survey for a chance to win a Microsoft prize. Goodluck")
        }, 3000)
        //      session.send("Great! Here is your Azure pass: " + code + ". Go to http://www.microsoftazurepass.com/ and paste in this number and dont forget to come by the Microsoft booth and fill out our survey for a chance to win a Microsoft prize. Goodluck") //+pass
        //    session.endConversation;
    }]
);

function RetrievePass() {
    var query = new azure.TableQuery()
        .top(1)
        .where('Used eq ?', false);

    tableSvc.queryEntities('AzureCredits', query, null, function (error, result, response) {
        if (!error) {
            code = result.entries[0].Code._;
            console.log(code);
            var row = result.entries[0].RowKey._;
             UpdateCreditTable(row);           

        }
        else
            console.log(error);
    });
}
function UpdateCreditTable(row) {
    var entGen = azure.TableUtilities.entityGenerator;
    var updatedtask = {
        PartitionKey: entGen.String('Credit'),
        RowKey: entGen.String(row),
        Used: true
    };

    tableSvc.mergeEntity('AzureCredits', updatedtask, function (error, result, response) {
        if (!error) {
            console.log("Credit Updated")
        }
        else
            console.log(error);
    });
}

function UpdateStudentTable() {
    var entGen = azure.TableUtilities.entityGenerator;
    var task = {
        PartitionKey: entGen.String('Student'),
        RowKey: entGen.String(email),
        Timestamp: entGen.DateTime(new Date(Date.now())),
        Name: entGen.String(name),
        University: entGen.String(univ),
        ProjectDetails: entGen.String(proj)
    };

    tableSvc.insertEntity('AzureCreditStudents', task, function (error, result, response) {
        if (!error) {
            console.log("Student added")
        }
        else
            console.log(error);
    });
}
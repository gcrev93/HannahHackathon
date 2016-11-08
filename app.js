var restify = require('restify');
var mail = require('./mailex.js')
var builder = require('botbuilder');
var env = require('./env.js');
var azure = require('azure-storage');
var validator = require('validator');

//=========================================================
// Azure Table Setup
//=========================================================
var tableSvc = azure.createTableService("azurecredits", process.env.AZURE_STORAGE);

var name, univ, proj, email, code, num;

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
        session.send("Hello! Welcome to the Azure Credit Bot. Would you like an Azure Credit today? (Please say Yes/No)")
        session.beginDialog('/name');
    });

bot.dialog('/name', new builder.IntentDialog()
    .matches(/^yes/i, [
        function (session) {

            builder.Prompts.text(session, "Ok lets get you set up! What is your full name?")
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
        if (validator.isEmail(results.response)) {
            email = results.response;
            session.beginDialog('/school')
        }
        else {
            session.send("Invalid email")
            session.beginDialog('/email');
        }


    }]
);

bot.dialog('/school', [
    function (session) {
        builder.Prompts.text(session, "What university do you go to?");
    },
    function (session, results) {
        univ = results.response;
        session.beginDialog('/number')
    }]
);

bot.dialog('/number', [
    function (session) {
        builder.Prompts.text(session, "What is your phone number?");
    },
    function (session, results) {
        if(validator.isMobilePhone(results.response, 'en-US')){
        num = results.response;
        session.beginDialog('/project')
        }
        else {
            session.send("Invalid phone number")
            session.beginDialog('/number');
        }
    }]
);

bot.dialog('/project', [
    function (session) {
        builder.Prompts.text(session, "That's Awesome!!! Tell me a little bit about your project! ")
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
        setTimeout(function () {
            session.send("Great! Here is your Azure pass: " + code + ". You will also get a confirmation email with your Azure pass. To activate: Go to http://www.microsoftazurepass.com/ and paste in this number and dont forget to fill out our survey at https://aka.ms/calhacks for a chance to win a Xbox one, GoPro Hero 3+ White with headstrap and quickclip, or a 10 min massage. Good luck!")
        }, 3000)
        session.endConversation;
    }]
);

function RetrievePass() {
    var query = new azure.TableQuery()
        .top(1)
        .where('Used eq ?', false);

    tableSvc.queryEntities('AzureCredits', query, null, function (error, result, response) {
        if (!error) {
            code = result.entries[0].Code._;
            var row = result.entries[0].RowKey._;
            UpdateCreditTable(row);
            mail.SendMail(email, code);

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
        PhoneNumber: entGen.String(num),
        ProjectDetails: entGen.String(proj),
        AzureCode: entGen.String(code)
    };

    tableSvc.insertEntity('AzureCreditStudents', task, function (error, result, response) {
        if (!error) {
            console.log("Student added")
        }
        else
            console.log(error);
    });
}

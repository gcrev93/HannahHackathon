const builder = require('botbuilder')

const lib = new builder.Library('botHelp')
lib.dialog('/', [
  function (session, args, next) {
    session.endDialog('I can help you get an Azure Code, find resources, or connect you with our Microsoft team! What would you like help with?')
  }
]).triggerAction({
  matches: 'botHelp'
})

module.exports.createLibrary = function () {
  return lib.clone()
}

const builder = require('botbuilder')

const lib = new builder.Library('greeting')
lib.dialog('/', [
  function (session, args, next) {
    session.send('Hello there!')
    session.endDialog('I can help you get an Azure Code, find resources, or connect you with our Microsoft team! What would you like help with?')
  }
]).triggerAction({
  matches: 'greeting',
  intentThreshold: 0.8
})

module.exports.createLibrary = function () {
  return lib.clone()
}

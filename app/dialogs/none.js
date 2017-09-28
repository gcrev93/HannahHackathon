const builder = require('botbuilder')

// TODO: This should be an "onDefault" not a trigger action
const lib = new builder.Library('none')
lib.dialog('/', [
  function (session, args, next) {
    // TODO: Investigate why there is an if block here
    if (args.text === 'no') {
    } else {
      session.send("I'm sorry, I didn't understand that.")
      session.endDialog('I can help you get an Azure Code, find resources, or connect you with our Microsoft team! What would you like help with?')
    }
  }
]).triggerAction({
  matches: 'None'
})

module.exports.createLibrary = function () {
  return lib.clone()
}

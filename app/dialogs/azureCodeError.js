const builder = require('botbuilder')

const lib = new builder.Library('azureCodeError')
lib.dialog('/', [
  function (session, args, next) {
    session.endDialog("Oh no! We're sorry to hear that. Please try again - I will hand you a new code.")
  }
]).triggerAction({
  matches: 'azureCodeError'
})

module.exports.createLibrary = function () {
  return lib.clone()
}

const builder = require('botbuilder')

const lib = new builder.Library('profanity')
lib.dialog('/', [
  function (session, args, next) {
    session.endDialog('Hey! Watch it!')
  }
]).triggerAction({
  matches: 'profanity'
})

module.exports.createLibrary = function () {
  return lib.clone()
}

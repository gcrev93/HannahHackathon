const builder = require('botbuilder')

const lib = new builder.Library('negativeComment')
lib.dialog('/', [
  function (session, args, next) {
    session.endDialog("That's not very nice.. If you come by the booth we can help you out in person!")
  }
]).triggerAction({
  matches: 'negativeComment'
})

module.exports.createLibrary = function () {
  return lib.clone()
}

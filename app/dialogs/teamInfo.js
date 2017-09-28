const builder = require('botbuilder')
const createCard = require('../utilities/createCard')

const lib = new builder.Library('teamInfo')
lib.dialog('/', [
  function (session, args, next) {
    // create the card based on selection
    const card = createCard(session)

    // attach the card to the reply message
    const msg = new builder.Message(session).addAttachment(card)
    session.send(msg)
    session.endDialog('Come stop by the booth and meet our team! We can help you out with your projects and bounce ideas around... or just hang out :)')
  }
]).triggerAction({
  matches: 'teamInfo'
})

module.exports.createLibrary = function () {
  return lib.clone()
}

const builder = require('botbuilder')
const tech = require('../../data/techResources')

const lib = new builder.Library('techHelp')
lib.dialog('/', [
  function (session, args, next) {
    // Get array of all current tech names
    var techs = []
    tech.forEach(t => {
      techs.push(t.name)
    })

    session.send('A great first step to getting help is to head to https://docs.microsoft.com, but if you need something more specific I\'d be more than happy to help!')
    builder.Prompts.choice(session, 'Which technology do you need help with? (Choose a number)', techs)
  },
  function (session, results) {
    console.log(results.response)

    // Send the correct prompt based on the option selected
    tech.forEach((t, i) => {
      if (i === results.response.index) {
        session.endDialog(t.prompt)
      }
    })

    // If we didn't end the dialog, something went wrong
    session.endDialog("If I can't help you with any of your needs you can head to our booth and talk with someone or email the team at usdxmsfthack@outlook.com")
  }
]).triggerAction({
  matches: 'techHelp'
})

module.exports.createLibrary = function () {
  return lib.clone()
}

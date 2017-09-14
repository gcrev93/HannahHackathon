const builder = require('botbuilder')

const lib = new builder.Library('endConvo')
lib.dialog('/', [
  function (session, args, next) {
    session.send('Let me know if you need something else!')
  }
]).triggerAction({
  matches: 'endConvo'
})

module.exports.createLibrary = function () {
  return lib.clone()
}

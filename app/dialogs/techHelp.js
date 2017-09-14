const builder = require('botbuilder')

const techhelp = ['Unity', 'Xamarin', 'Azure', 'Hardware', 'IoT', 'Hololens', 'Cognitive Services', 'ChatBots', 'Other']

const lib = new builder.Library('techHelp')
lib.dialog('/', [
    // TODO: Refactor this to be more dynamic
  function (session, args, next) {
    builder.Prompts.choice(session, 'Which technology do you need help with? (Choose a number)', techhelp)
  },
  function (session, results) {
    console.log(results.response)
    switch (results.response.index) {
      case 0:
        session.send('To get started with Unity, check out the documentation at https://docs.unity3d.com/Manual/index.html . You can also find some of their tutorials at https://unity3d.com/learn/tutorials. Our very own Gavin can also help you. See if you can find him at the booth')
        break
      case 1:
        session.send('You can find a lot of great Xamarin resources at https://developer.xamarin.com/. You can also ask for Gavin or David G. at our booth and he can help')
        break
      case 2:
        session.send('Feel free to head to the booth to find an Azure expert, but here are some Azure docs. For Azure App Services, head over to this link: https://docs.microsoft.com/en-us/azure/app-service/ . For Azure Storage check out https://docs.microsoft.com/en-us/azure/storage/ . And for Azure Mobile Apps head over to https://docs.microsoft.com/en-us/azure/app-service-mobile/app-service-mobile-android-get-started')
        break
      case 3:
        session.send("If you are looking for help with Hardware boards head to the booth and talk to Rae, Brian, Hao or Kevin :). You can also email usdxmsfthack@outlook.com if you can't immediately find them.")
        break
      case 4:
        session.send('For Azure IoT you can check out https://docs.microsoft.com/en-us/azure/iot-hub/ . You can also ask for Brian at the booth!')
        break
      case 5:
        session.send('If you need help with Hololens, you can talk to Gavin or Brian at our Microsoft booth. You can also check out the docs at https://developer.microsoft.com/en-us/windows/holographic')
        break
      case 6:
        session.send('For Cognitive Services docs head to https://www.microsoft.com/cognitive-services/en-us/documentation. At the booth Hao, Kevin and David G are great to help you with Cognitive Services! ')
        break
      case 7:
        session.send('You want to know how to build a bot like me? Head to https://docs.botframework.com/en-us/. You can also head to booth where various team members can help you!')
        break
      case 8:
        session.send('If you need help with a technology not on this list, email us at usdxmsfthack@outlook.com so we can find someone to answer your questions.')
        break
      default:
        session.send("If I can't help you with any of your needs you can head to our booth and talk with someone or email the team at usdxmsfthack@outlook.com")

    }
  }
]).triggerAction({
  matches: 'techHelp'
})

module.exports.createLibrary = function () {
  return lib.clone()
}

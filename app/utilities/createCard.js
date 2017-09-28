const builder = require('botbuilder')
const hackData = require('../../data/hackSpecificData')

module.exports = (session) => {
  var members = []
    // Populate array of team members
  hackData.teamMembers.forEach(t => {
    var focus = ''
    // Create string to represent each member's focus
    t.techFocus.forEach((f, i) => {
      if (i === t.techFocus.length - 1) {
        focus += `${f} `
        return
      }
      focus += `${f}, `
    })

    // Create card representing each member and add it to the arry
    members.push(builder.ReceiptItem.create(session, '', t.name)
      .subtitle(focus)
      .quantity(400)
      .image(builder.CardImage.create(session, t.photoLink)))
  })

  // TODO: use an adaptive card instead
  // Return a receipt card representing the whole team
  return new builder.ReceiptCard(session)
        .title(`Microsoft @ ${hackData.hackName}`)
        .facts([
          builder.Fact.create(session, '', 'Meet the team!')
        ])
        .items(members)
}

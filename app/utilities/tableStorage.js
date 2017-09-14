const azure = require('azure-storage')
const mail = require('./mailex.js')

// =========================================================
// Azure Table Setup
// =========================================================
const tableSvc = azure.createTableService('azurecredits', process.env.AZURE_STORAGE)

function updateCreditTable (row) {
  const entGen = azure.TableUtilities.entityGenerator
  const updatedtask = {
    PartitionKey: entGen.String('Credit'),
    RowKey: entGen.String(row),
    Used: true
  }

  tableSvc.mergeEntity('AzureCredits', updatedtask, function (error, result, response) {
    if (!error) {
      console.log('Credit Updated')
    } else {
      console.log(error)
    }
  })
}

function updateStudentTable (userData) {
  const entGen = azure.TableUtilities.entityGenerator
  const task = {
    PartitionKey: entGen.String('Student'),
    RowKey: entGen.String(userData.email), // must be unique
    Timestamp: entGen.DateTime(new Date(Date.now())),
    Name: entGen.String(userData.name),
    University: entGen.String(userData.university),
    PhoneNumber: entGen.String(userData.number),
    ProjectDetails: entGen.String(userData.project),
    AzureCode: entGen.String(userData.code)
  }

  tableSvc.insertEntity('AzureCreditStudents', task, function (error, result, response) {
    if (!error) {
      console.log('Student added')
    } else {
      console.log(error)
    }
  })
}

// TODO: Set up env and make sure this flow works as expected
module.exports = {
  tableSvc: tableSvc,

  getPassOnlyOnUniqueEmail: (session, ifUnique, ifNotUnique, next) => {
    const query = new azure.TableQuery()
      .top(1)
      .where('RowKey eq ?', session.userData.email)

    tableSvc.queryEntities('AzureCreditStudents', query, null, function (error, result, response) {
      if (error) {
        console.log(error)
        return
      }

      if (result.entries.length > 0) {
        // If the JSON response is greater than 0 then that means the email does exist
        ifNotUnique(next)
      } else {
        // If JSON response is 0 then the email DOES NOT exist
        ifUnique()
      }
    })
  },

  retrievePass: (session, onQueryFinish, next) => {
    const query = new azure.TableQuery()
      .top(1)
      .where('Used eq ?', false)

    tableSvc.queryEntities('AzureCredits', query, null, function (error, result, response) {
      if (error) {
        console.log(error)
        return
      }

      session.userData.code = result.entries[0].Code._
      const row = result.entries[0].RowKey._
      updateCreditTable(row)
      mail.SendMail(session.userData.email, session.userData.code)
      onQueryFinish(session)
      updateStudentTable(session.userData)
    })
  }
}

# Hannah the Hackathon Helper

## Who is She
Hannah was built to assist with hackathons! She has 3 main capabilities:
- Handing out Azure Passes to students
- Introducing students to the hack team members onsite
- Answering questions about specific MS Technologies

## Customize Her to Your Needs
You can customize the technologies and team members for each hackathon so Hannah can be more reusable. 

Hannah's hackathon specific settings are in the `data/hackSpecificData.js` file. You can customize the name of the hackathon, survey link, prize, and team members in the following format. Each team member will be picked up by the `app/dialogs/teamInfo` dialog and added to the card of team members automatically.

```javascript
{
  hackName: 'CalHacks',
  surveyLink: 'aka.ms/CalHacksSurvery',
  prize: 'an XBox One',
  teamMembers: [
    {
      name: 'Jane Doe',
      techFocus: ['Azure', 'Bot Framework'],
      photoLink: 'samplelink.com'
    },
    ...
  ]
}
```

You can also customize the technologies Hannah knows how to help with by edititng the `data/techResources` file. Add, delete or modify the technologies listed here to change how the bot responds in the `app/dialogs/techHelp` dialog.

```javascript
[
  {
    name: 'ChatBots',
    prompt: 'You want to know how to build a bot like me? Head to https://docs.botframework.com/en-us/. You can also head to booth where various team members can help you!'
  },
  ...
]
```

## Setup

### Create an Azure Storage Account
Follow [this guide](https://docs.microsoft.com/en-us/azure/storage/common/storage-create-storage-account) to create your storage account. Once it is created, add two tables with the naming specified below. Changes to capitalization and spelling might break the existing code so be sure to create the correct tables.

Create a table to store all of the azure codes for the event. 
- Name: `AzureCredits`
- Required Columns
    - `Partition Key` The values here will always be `Credits`
    - `Row Key` The azure code, it is primary key for the table
    - `Used` Boolean value to represent whether the credit has been given out or not
    - `Timestamp`

Create a second table to store the student information.
- Name: `AzureCreditStudents`
- Required Columns
    - `Partion Key` The values here will always be `Student`
    - `Row Key` The student's email, it is the primary key for the table
    - `AzureCode` The code that was assigned to the student
    - `Name`
    - `University`
    - `PhoneNumber`
    - `ProjectDetails`
    - `Timestamp`

### Set up Your Environment Variables
There are several variables that need to be set in order for the app to run properly. Start by creating a `.env` file in the root directory, use the `.env.example` as a template for the values you need.

- APP_ID= The app id that you got after you register your bot on [botframework.com](https://botframework.com)
- APP_PASS= The app password that you got after you register your bot on [botframework.com](https://botframework.com)
- LUIS_ID= The id for your [https://luis.ai](LUIS) model
- LUIS_KEY= The subscription key for your [https://luis.ai](LUIS) model
- EMAIL_PASS= The password for the email account you will send confirmation emails from
- EMAIL_USERNAME= The email account you will send confirmation emails from
- AZURE_STORE_CONNSTR= The primary connection string for your storage account (obtainment and setup info above)

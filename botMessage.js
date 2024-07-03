// https://seapi.c4ldas.com.br/botMessage/c4ldas

const express = require('express')
const router = express.Router()
const seURL = 'https://api.streamelements.com/kappa'

/*************************************************
//                   Routes                     //
*************************************************/

router.get('/massban', async (req, res) => {

  const channelList = ['gabite_tv', 'otsukaxd', 'coreano', 'breezefps', 'piranhaagricola', 'nuuhfps', 'xandfps', 'dannyjones', 'horakawa', 'belky', 'bldcs', 'm4ndzin', 'tooug', 'tayhuhu', 'daiyana', 'pipoca__0', 'itslilii', 'amandasl7', 'tck10']

  accountIdResult = []

  for (element of channelList) {
    const accountId = await getAccountId(element);
    const helloDarkness = await botMessage(accountId, req.query.message);
    accountIdResult.push(`${element}: ${JSON.stringify(helloDarkness)}`);
  }

  console.log(accountIdResult);
  res.send(accountIdResult);
})


router.get('/:channel', async (req, res) => {
  const channel = req.params.channel
  const accountId = await getAccountId(channel);
  const message = await botMessage(accountId, req.query.msg);

  res.status(200).send(message)
})


/*************************************************
//                 Functions                    //
*************************************************/

// Get Account ID of username
async function getAccountId(channel) {

  try {
    const accountIdRequest = await fetch(`${seURL}/v2/channels/${channel}`, {
      "method": "GET",
      "headers": {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.SE_JWT_TOKEN}`
      }
    });
    const accountIdResponse = await accountIdRequest.json();
    const accountId = accountIdResponse._id;
    return accountId;

  } catch (error) {
    console.log("getAccountId() Error:", error)
    return error
  }
}


// Send message as Streamelements bot
async function botMessage(accountId, chatMessage) {

  try {
    const messageStatusFetch = await fetch(`${seURL}/v2/bot/${accountId}/say`, {
      "method": "POST",
      "headers": {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.SE_JWT_TOKEN}`
      }, 
      "body": JSON.stringify({ "message": chatMessage })
    });
    const messageStatus = await messageStatusFetch.json();
    // console.log(messageStatus);
    return messageStatus;
    
  } catch (error) {
    console.log("botMessage() Error: ", error)
    return error
  }
}

module.exports = router

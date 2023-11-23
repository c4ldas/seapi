// https://seapi.c4ldas.com.br/botMessage/c4ldas

const axios = require('axios').default
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
    const accountId = await getAccountId(element)
    const helloDarkness = await botMessage(accountId, req.query.message)

    accountIdResult.push(`${element}: ${JSON.stringify(helloDarkness)}`)
  }

  console.log(accountIdResult)
  res.send(accountIdResult)
})

router.get('/:channel', async (req, res) => {

  const channel = req.params.channel
  const accountId = await getAccountId(channel)
  const message = await botMessage(accountId, req.query.msg)

  res.status(200).send(message)
})



/*************************************************
//                 Functions                    //
*************************************************/

// Get Account ID of username
async function getAccountId(channel) {

  try {
    const accountIdRequest = await axios.get(`${seURL}/v2/channels/${channel}`, {
      // timeout: 1000,
      'headers': {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SE_JWT_TOKEN}`
      }
    })
    const accountId = await accountIdRequest.data._id
    return accountId

  } catch (error) {
    console.log(error.response.data)
    return error.response.data
  }
}


// Send message as Streamelements bot
async function botMessage(accountId, chatMessage) {

  try {
    const messageStatusFetch = await axios.post(`${seURL}/v2/bot/${accountId}/say`,
      {
        'message': chatMessage
      },
      {
        'headers': {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SE_JWT_TOKEN}`
        }
      }
    );

    const messageStatus = await messageStatusFetch.data
    // console.log(messageStatus)
    return messageStatus

  } catch (error) {
    console.log("Erro: ", error.response.data)
    // return { error: error.response.data.message, code: error.response.data.statusCode }
    return error.response.data
  }
}

module.exports = router


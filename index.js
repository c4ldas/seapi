// Home page
// Usage: https://seapi.c4ldas.com.br
// https://seapi.c4ldas.com.br/top/c4ldas?amount=5&points=true
// https://seapi.c4ldas.com.br/botMessage/c4ldas?msg=MESSAGE

const { app, axios, db } = require('./app');
const { style, unauthorizedPage } = require('./pageItems')
const { seURL, seClientID, seClientSecret, seRedirectURI, seScopes } = require('./environment')

/*************************************************
//                   Routes                     //
*************************************************/

// Home page. The variables are in environment.js file
app.get('/', async (req, res) => {
  res.redirect('/overlays')
})

// Answering to the ping from other repo just to keep this repo awake
app.get('/ping', async (req, res) => {
  res.status(200).json({ status: 'success' })
  /* console.log({ date: new Date().toLocaleTimeString('en-UK'), status: 'success' }) */
})

// Login page to authenticate to StreamElements
app.get('/login', async (req, res) => {
  const scopes = req.query.scope || seScopes
  const state = req.query.state || ''

  res.redirect('https://api.streamelements.com/oauth2/authorize?' +
    new URLSearchParams({
      client_id: seClientID,
      redirect_uri: seRedirectURI,
      response_type: 'code',
      scope: scopes,
      state: state
    })
  )
})

app.get('/leaderboard/', async (req, res) => {
  res.status(200).render('./leaderboard/index.ejs')
})

// Database operations
app.get('/database/:operation/:id', async (req, res) => {
  const dbRequest = await databaseOperation(req.params.operation, req.params.id)
  res.status(200).json(dbRequest)
})

// Get the overlay code
app.get('/overlays/get/:id', async (req, res) => {
  const dbRequest = await databaseOperation("get", req.params.id)
  res.status(200).json(dbRequest)
})

// Accessing the overlay page
app.get('/overlays', async (req, res) => {
  res.status(200).render('overlays/index')
  // Getting overlay codes available
  console.log(`${new Date().toLocaleTimeString('en-UK')} - DB List:`, await db.list())
})

// List overlays
app.get('/overlays/overlaysList', async (req, res) => {
  const { overlaysList } = req.session
  res.status(200).render('./overlays/overlayList.ejs', { overlaysList })
})

// Generate sharing code
app.get('/overlays/share/:accountId/:id', async (req, res) => {
  const overlayId = req.params.id
  const accountId = req.params.accountId

  const response = await getOverlayConfig(accountId, overlayId)
  res.status(200).render('./overlays/overlayShareCode.ejs', { code: response })
  // res.status(200).send(response.toString())
})

// Open page asking for overlay code to be installed
app.get('/overlays/overlayCode', async (req, res) => {
  res.status(200).render('./overlays/overlayCode.ejs', { isValid: true })
})

// Authorization page to install the overlay
app.get('/overlays/install/:id', async (req, res) => {
  req.session['code'] = req.params.id
  const code = await db.get(req.session['code'])
  // In case the code is not on database anymore, return to the page informing the code is invalid
  if (!code) {
    res.status(400).render('./overlays/overlayCode.ejs', { isValid: false })
    return
  }
  res.redirect(`https://seapi.c4ldas.com.br/login?scope=overlays:write overlays:read&state=overlay_install`)
})

// Callback page
app.get('/callback', async (req, res) => {

  // In case the user does not authorize the application, send an error message
  if (!req.query.code || req.query.error) {
    res.status(401).send(style + unauthorizedPage)
    return
  }

  try {
    // Get Access token and refresh token from code received from callback URL
    const data = await getAuthentication(req.query.code)

    // Get Channel Information 
    const channelData = await getChannelData(data)

    // Reading overlay list in case the scope is only "overlays:read", used by /overlays page
    if (req.query.state == 'overlay_share') {
      const overlaysList = await overlayList(data, channelData)

      req.session['overlaysList'] = overlaysList.overlaysList;
      req.session.cookie.maxAge = 600000

      res.redirect('/overlays/overlaysList')
      return
    }

    // Asking the code to install the new overlay
    if (req.query.state == 'overlay_install') {
      const code = req.session['code']
      const result = await overlayInstallation(data, channelData, code)
      const { overlayId, apiToken, overlayName, overlayWidth, overlayHeight } = result
      res.status(200).render('./overlays/overlayInstallButton.ejs', { overlayId, apiToken, overlayName, overlayWidth, overlayHeight })

      // After overlay is installed, remove Account ID and Overlay code from database
      db.delete(code).then(() => { console.log('Code removed from database!') })
      db.delete(channelData._id).then(() => { console.log('Account ID removed from database!') })
      return
    }

    if (!req.query.state) {
      // Just a simple authenticated page with user information. 
      // Not really useful, just to confirm the authentication is working
      const authenticatedPage = ` \
        <div class="authenticated"> \
          <h1>Authenticated!</h1>
          <img style="border-radius: 50%;" src="${channelData.avatar}" /> \
          <div><strong>Display Name:</strong> ${channelData.displayName}</div> \
          <div><strong>Account ID:</strong> ${channelData._id}</div> \
          <div><strong>Access Token:</strong> ${data.access_token}</div> \
        </div> \
        `
      res.status(200).send(style + authenticatedPage)
      return
    }

  } catch (error) {
    res.status(500).send(error.code);
    console.log('Error: ', error);
  }
})

// Getting the top users on Streamelements leaderboard
// Usage: https://seapi.c4ldas.com.br/top/c4ldas?amount=5
app.get('/top/:username', async (req, res) => {

  const points = req.query.points || false
  const amount = req.query.amount;
  const accountId = await getAccountId(req.params.username);

  if (amount < 1 || amount > 1000) {
    res.status(200).send(`Minimum amount: 1. Max amount: 1000`)
    return
  }

  if (accountId.code == 404) {
    res.status(404).send(`Channel not found`)
    console.log('Account Id for that username not found')
    return
  }

  const topUser = await getTopLeaderboard(accountId, amount, points)
  console.log(`${new Date().toLocaleTimeString('en-UK')} - Channel: ${req.params.username} - Users: ${topUser}`)
  res.status(200).send(`${topUser}`)
})


// Getting the top watchtime on Streamelements leaderboard
// Usage: https://seapi.c4ldas.com.br/watchtime/c4ldas?amount=5
app.get('/watchtime/:username', async (req, res) => {

  const minutes = req.query.minutes || false
  const amount = req.query.amount;
  const accountId = await getAccountId(req.params.username);

  if (amount < 1 || amount > 100) {
    res.status(200).send(`Minimum amount: 1. Max amount: 100`)
    return
  }

  if (accountId.code == 404) {
    res.status(404).send(`Channel not found`)
    console.log('Account Id for that username not found')
    return
  }
  const topWatchtime = await getTopWatchtime(accountId, amount, minutes);
  console.log(`${new Date().toLocaleTimeString('en-UK')} - Channel: ${req.params.username} - Users: ${topWatchtime}`);
  res.status(200).send(`${topWatchtime}`)
})


/*************************************************
//                 Functions                    //
*************************************************/

// Overlay List
async function overlayList(data, channelData) {
  const overlayFetch = await axios.get(`https://api.streamelements.com/kappa/v2/overlays/${channelData._id}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `oAuth ${data.access_token}`
    }
  })
  // Generate a grid with all overlays from that user. 
  // The overlay list has the name and the background image of each one
  overlayArray = []
  overlayFetch.data.docs.forEach(element => {
    overlayArray.push(`
          <div class="wrapper">
            <div class="item-name">${element.name}</div>
            <a href='/overlays/share/${channelData._id}/${element._id}'>
              <div id='${element._id}' class="item" style="background-image: url('${element.preview}');"></div>
            </a>
          </div>
        `)
  })
  const overlaysList = overlayArray.toString().replaceAll(',', '')
  return { overlaysList }
}

// Overlay Share - Generate code
async function getOverlayConfig(accountId, overlayId) {
  const accountIdDatabase = await db.get(accountId)
  const token = accountIdDatabase.access_token
  accountIdDatabase.code = Date.now()

  const { data } = await axios.get(`https://api.streamelements.com/kappa/v2/overlays/${accountId}/${overlayId}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `oAuth ${token}`
    }
  })
  // Create database entry for overlay code and delete Account ID from database after code generated
  await db.set(accountIdDatabase.code, data)
  await db.delete(accountId).then(() => { console.log('Account ID deleted from database') })

  return accountIdDatabase.code
}

// Overlay installation - Add overlay to SE destination account
async function overlayInstallation(tokenInfo, channelData, code) {
  const overlayData = await db.get(code)

  if (!overlayData) {
    return { isValid: false, overlayId: null, apiToken: null, overlayName: null, overlayWidth: null, overlayheight: null }
  }

  const { data } = await axios.post(`https://api.streamelements.com/kappa/v2/overlays/${channelData._id}`,
    overlayData,
    {
      headers: {
        Accept: 'application/json',
        Authorization: `oAuth ${tokenInfo.access_token}`
      }
    })

  //URL format:
  // https://streamelements.com/overlay/data._id/channelData.apiToken
  return {
    isValid: true, overlayId: data._id, apiToken: channelData.apiToken, overlayName: data.name,
    overlayWidth: data.settings.width, overlayHeight: data.settings.height
  }

}

// Get Authentication token
async function getAuthentication(code) {
  const { data } = await axios.post('https://api.streamelements.com/oauth2/token?' +
    new URLSearchParams({
      'client_id': seClientID,
      'client_secret': seClientSecret,
      'grant_type': 'authorization_code',
      'code': code,
      'redirect_uri': seRedirectURI
    })
  );
  console.log('Get Authentication: ', data)
  return data
}

// Get channel information
async function getChannelData(tokenInfo) {
  const { data } = await axios.get('https://api.streamelements.com/kappa/v2/channels/me', {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `oAuth ${tokenInfo.access_token}`
    }
  })
  // console.log('Get Channel Information: ', data)
  db.set(data._id, { username: data.username, access_token: tokenInfo.access_token, refresh_token: tokenInfo.refresh_token })
  return data
}

// Get Account ID from username
async function getAccountId(username) {
  try {
    const accountIdRequest = await axios.get(`${seURL}/v2/channels/${username}`, {
      timeout: 1000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    const accountId = await accountIdRequest.data._id
    return accountId
  } catch (error) {
    console.log('Error getting account ID: ', error.response.data)
    return { error: error.response.data.message, code: error.response.data.statusCode }
  }
}

// Get top leaderboard users based on account ID
async function getTopLeaderboard(accountId, amount = 1, points) {
  try {
    const topUsernameRequest = await axios.get(`${seURL}/v2/points/${accountId}/top?limit=${amount}&offset=0`, {
      timeout: 1000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })

    const usersArray = await topUsernameRequest.data.users
    const totalUsers = []

    usersArray.forEach((element, index) => {
      if (points == 'true') {
        totalUsers.push(`${index + 1}. ${element.username} (${element.points})`)
      } else {
        totalUsers.push(`${element.username}`)
      }
    })
    const topUsernames = totalUsers.join(', ')
    return topUsernames

  } catch (error) {
    console.log(error.response.data)
    return { error: error.response.data.message, code: error.response.data.statusCode }
  }
}


// Get top watchtime users based on account ID
async function getTopWatchtime(accountId, amount = 1, minutes) {
  try {
    const topWatchtimeRequest = await axios.get(`${seURL}/v2/points/${accountId}/watchtime?limit=${amount}&offset=0`, {
      timeout: 1000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })

    const usersArray = await topWatchtimeRequest.data.users
    const totalUsers = []

    usersArray.forEach((element, index) => {
      if (minutes == 'true') {
        const convertedMinutes = calculateTime(element.minutes)
        totalUsers.push(`${index + 1}. ${element.username} (${convertedMinutes})`)
      } else {
        totalUsers.push(`${element.username}`)
      }
    })
    const topUsernames = totalUsers.join(', ')
    return topUsernames

  } catch (error) {
    console.log(error.response.data)
    return { error: error.response.data.message, code: error.response.data.statusCode }
  }
}

// Convert minutes in days, hours and minutes
function calculateTime(minutes) {
  const days = Math.floor(minutes / (60 * 24));
  const hours = Math.floor((minutes % (60 * 24)) / 60);
  const remainingMinutes = minutes % 60;

  let result = '';
  if (days > 0) {
    result += `${days}d`;
  }
  if (hours > 0) {
    if (result !== '') {
      result += ', ';
    }
    result += `${hours}h`;
  }
  if (remainingMinutes > 0) {
    if (result !== '') {
      result += ', ';
    }
    result += `${remainingMinutes}m`;
  }
  return result;
}

// Database operations
async function databaseOperation(operation, id) {
  if (operation != 'get' && operation != 'delete') {
    return { status: 'error', statusCode: 400, message: 'Invalid operation' }
  }

  const request = await db[operation](id)

  if (!request) {
    return { status: 'error', statusCode: 404, message: 'Not found' }
  }
  if (request?.key) {
    console.log({ status: 'ok', statusCode: 200, message: 'Operation completed successfully!' })
    return { status: 'ok', statusCode: 200, message: 'Operation completed successfully!' }
  }
  return request
}


// Starting application
app.listen(8800, () => console.log('listening'))

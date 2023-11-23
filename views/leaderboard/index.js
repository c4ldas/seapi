const download = document.querySelector('#download');
const hidden = document.querySelector('#hidden')
const limitDiv = document.querySelector('#limit')
const offsetDiv = document.querySelector('#offset')
const errorMessage = document.querySelector('#error-message')
const username = document.querySelector('#username')

document.body.addEventListener('change', async (event) => {

  target = event.target;
  if (target.value == 'top') {
    console.log(target.value)
    hidden.style.display = 'flex';
    errorMessage.style.display = 'none'
  } else if (target.value == 'alltime') {
    console.log(target.value)
    hidden.style.display = 'none'
    errorMessage.style.display = 'none'
  }
})

download.addEventListener('click', async () => {
  errorMessage.style.display = 'none'
  errorMessage.style.color = 'red'
  errorMessage.innerText = ''

  const radio = document.querySelector('input[name="type"]:checked');

  if (username.value == '' || !radio) {
    console.log(radio)
    errorMessage.innerText = 'Please type the username and select the option!'
    errorMessage.style.display = 'block'
    return
  }

  if (radio.value == 'top' && (limitDiv.value == '' || offsetDiv.value == '')) {
    errorMessage.innerText = "Please fill the fields for 'Top'"
    errorMessage.style.display = 'block'
    return
  }

  // const username = document.querySelector('#username').value;
  const limit = radio.value == 'alltime' ? '999999' : limitDiv.value;
  const offset = radio.value == 'alltime' ? '0' : offsetDiv.value;

  console.log(radio.value);

  // Generating file
  errorMessage.innerText = 'Generating CSV file...'
  errorMessage.style.color = 'blue'
  errorMessage.style.display = 'block'

  const accountIdFetch = await fetch(`https://api.streamelements.com/kappa/v2/channels/${username.value}`);
  const accountIdResponse = await accountIdFetch.json();
  const accountId = accountIdResponse._id;

  if (!accountId) {
    errorMessage.innerText = 'User not found!'
    errorMessage.style.color = 'red'
    errorMessage.style.display = 'block'
  }

  const leaderboardFetch = await fetch(`https://api.streamelements.com/kappa/v2/points/${accountId}/${radio.value}?offset=${offset}&limit=${limit}`);



  const leaderboardResponse = await leaderboardFetch.json();
  const title = Object.keys(leaderboardResponse.users[0]).toString();
  const lineBreak = '\r\n';
  var text = title + lineBreak;

  for (x in leaderboardResponse.users) {
    line = Object.values(leaderboardResponse.users[x]).toString();
    text += line + lineBreak;
  }



  // Create a Blob object with the CSV content
  const blob = new Blob([text], { type: 'text/csv;charset=utf-8;' });

  // Create a URL for the Blob
  const url = window.URL.createObjectURL(blob);

  // Create a link element for downloading
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'leaderboard.csv';

  // Add the link to the document body and trigger a click event to download
  document.body.appendChild(a);
  a.click();

  // Clean up by revoking the Blob URL
  window.URL.revokeObjectURL(url);
})





const container = document.querySelector('#container')
const shareOverlay = document.querySelector('#share-overlay')
const installOverlay = document.querySelector('#install-overlay')


shareOverlay.addEventListener('click', async () => {
  // Request overlays:read permissions
  location.href = 'https://seapi.c4ldas.com.br/login?scope=overlays:read overlays:write&state=overlay_share'
})

installOverlay.addEventListener('click', async () => {
  location.href = '/overlays/overlayCode'
})

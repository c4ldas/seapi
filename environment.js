const seURL = 'https://api.streamelements.com/kappa'
const seClientID = process.env.SE_CLIENT_ID
const seClientSecret = process.env.SE_CLIENT_SECRET
const seRedirectURI = process.env.SE_REDIRECT_URI
const seScopes = 'channel:read activities:read activities:write overlays:read overlays:write tips:read tips:write loyalty:read loyalty:write bot:read bot:write'

// Invalid scopes:
// session:read contest:read contest:write giveaway:read giveaway:write store:read store:write

module.exports = { seURL, seClientID, seClientSecret, seRedirectURI, seScopes }

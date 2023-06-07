const style = '<style> \
  html { \
    background-color: #272626; \
    color: #afaf87ff; \
  } \
  .unauthorized { \
    display: flex; \
    align-items: center; \
    justify-content: center; \
    flex-direction: column; \
   font-size: 2em; \
   font-family: monospace \
  } \
  .authenticated { \
    display: flex; \
    align-items: center; \
    justify-content: center; \
    flex-direction: column; \
    font-size: 2em; font-family: monospace \
  } \
  </style>'

const helloPage = '<p><h1>Hello!</h1></p>'

const topUsers = '<p><h2 style="border-style: dashed none; display:inline-block; padding: 5px;">List top users from Streamelements Leaderboard</h2><p>Get the top users on Streamelements leaderboard. You can set the amount of users (separated by comma) choosing the amount value.</p><p>Replace <strong>CHANNEL</strong> for your channel name and the amount of users you want to show</p><p style="display: inline-block; border: solid; padding: 5px; font-family: monospace;">https://seapi.c4ldas.com.br/top/<strong>CHANNEL</strong>?amount=<strong>3</strong>&points=<strong>true</strong></p></p>'

const activateItemStore = '<p><h2 style="border-style: dashed none; display:inline-block; padding: 5px;">Enable/Disable specific item on Store</h2>(not yet implemented)<p>Choose the item you want to activate/deactivate from store and run the chat command for that.</p><p>Choose if you either want to disable or enable the item using "action=disable" and "action=enable" query parameter</p><p style="display: inline-block; border: solid; padding: 5px;font-family: monospace;">https://seapi.c4ldas.com.br/store-item/<wbr><strong>CHANNEL</strong>/<wbr><strong>CODE</strong>/<wbr><strong>ITEM_NAME</strong><wbr>?action=disable|enable</p></p>'

const loginButton = '<p style="margin: 30px 10px"><a href="/login" class="seButton" style="text-decoration: none; border: 0.2px solid #000; color: #000; background: #8AE020; padding: 10px; margin: 30px">Login with Streamelements</a></p>'

const overlaysButton = '<p style="margin: 30px 10px"><a href="/overlays" class="seOverlaysButton" style="text-decoration: none; border: 2px solid #000; color: #000; background: #8AE020; padding: 10px; margin: 30px">Overlays Page</a></p>'

const unauthorizedPage = ` \
<div class="unauthorized"> \
  <p>Application not accepted</p> \
  <a href="./../">Previous page</a> \
</div> \
`

module.exports = { style, helloPage, topUsers, activateItemStore, loginButton, overlaysButton, unauthorizedPage }
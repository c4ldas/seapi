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

const unauthorizedPage = ` \
<div class="unauthorized"> \
  <p>Application not accepted</p> \
  <a href="./../">Previous page</a> \
</div> \
`

module.exports = { style, unauthorizedPage }

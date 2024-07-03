const express = require('express');
const router = express.Router();
const marked = require('marked');

//console.log(marked)

router.get('/', async (req, res) => {
  // res.status(200).sendFile(__dirname + '/index.html')

  // Read the contents of .md file
  const contentFetch = await fetch('https://raw.githubusercontent.com/c4ldas/streamelements-widgets/main/current-steam-game/readme.md')
  const content = await contentFetch.text()
  res.status(200).send(content)
  
  // Convert Markdown to HTML using marked
  // const htmlContent = marked.parse(content);

  // Now you can use the HTML content in your website
  // res.status(200).send(htmlContent)
  // console.log(htmlContent); // You can send this HTML content to your website's frontend for rendering */
})


module.exports = router;

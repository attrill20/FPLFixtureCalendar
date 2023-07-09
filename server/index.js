const express = require('express')
const app = express()
var cors = require('cors')
const port=3005

app.use(cors())

app.get('/', async (req, res) => {
  const response = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/')
  const body = await response.json();
  console.log(body)
  res.send(body)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
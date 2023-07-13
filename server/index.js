// const express = require('express');
// const fetch = require('node-fetch');
// const cors = require('cors');

// const app = express();
// const port = 3005;

// app.use(cors());

// app.get('/', async (req, res) => {
//   try {
//     const urls = [
//       'https://fantasy.premierleague.com/api/bootstrap-static/',
//       'https://fantasy.premierleague.com/api/fixtures/'
//     ];

//     const apiResponses = await Promise.all(urls.map(url => fetch(url)));
//     const apiData = await Promise.all(apiResponses.map(async response => await response.json()));

//     console.log(apiData);
//     res.send(apiData);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });




const express = require('express')
const app = express()
var cors = require('cors')
const port=3005

app.use(cors())

app.get('/', async (req, res) => {
  const response = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/')
  const details = await response.json();
  console.log(details)
  res.send(details)
})

// app.get('/', async (req, res) => {
//   // const response = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/')
//   const response = await fetch('https://fantasy.premierleague.com/api/fixtures/')
//   const body = await response.json();
//   console.log(body)
//   res.send(body)
// })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
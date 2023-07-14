// const express = require('express');
// const fetch = require('node-fetch');
// const cors = require('cors');

// const app = express();
// const port = 3005;

// app.use(cors());

// app.get('/', async (req, res) => {
//   try {
//     const responses = await Promise.all([
//       fetch('https://fantasy.premierleague.com/api/bootstrap-static/'),
//       fetch('https://fantasy.premierleague.com/api/fixtures/')
//     ]);

//     console.log(responses);

//     const data = await Promise.all(responses.map(response => response.json()));
    
//     // Send the data as the response
//     res.json(data);
//   } catch (error) {
//     // Send an error response if there's an error
//     res.status(500).json({ error: 'An error occurred' });
//     console.log(error)
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });


/////

//   try {
//     const urls = [
//       'https://fantasy.premierleague.com/api/bootstrap-static/',
//       'https://fantasy.premierleague.com/api/fixtures/'
//     ];

//     const apiResponses = await Promise.all(urls.map(url => fetch(url)));
//     const apiData = await Promise.all(apiResponses.map(async response => await response.json()));

//     console.log(apiData);
//     res.send(apiData);
//   } 
//   catch (error) 
//   {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });



// WORKING SINGLE API CALL
// const express = require('express')
// const app = express()
// var cors = require('cors')
// const port=3005

// app.use(cors())

// app.get('/', async (req, res) => {
//   const response = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/')
//   //   const response = await fetch('https://fantasy.premierleague.com/api/fixtures/')
//   const details = await response.json();
//   console.log(details)
//   res.send(details)
// })

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })

const express = require('express');
const cors = require('cors');

const app = express();
const port = 3005;

app.use(cors());

app.get('/', async (req, res) => {

    const bootstrapResponse = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/');
    const bootstrapData = await bootstrapResponse.json();
    
    const fixturesResponse = await fetch('https://fantasy.premierleague.com/api/fixtures/');
    const fixturesData = await fixturesResponse.json();

    console.log('Bootstrap Data:', bootstrapData);
    console.log('Fixtures Data:', fixturesData);

    const responseData = {
      bootstrapData: bootstrapData,
      fixturesData: fixturesData
    };

    res.send(responseData);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



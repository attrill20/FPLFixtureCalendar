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



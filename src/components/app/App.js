import React from 'react';
import './App.css';
import CardList from '../cardlist/cardlist';

const teams = [
  "Arsenal", "Aston Villa", "Bournemouth", "Brentford", "Brighton & Hove Albion", "Chelsea", "Crystal Palace", "Everton", "Fulham", "Leicester City", "Leeds United", "Liverpool", "Manchester City", "Manchester United", "Newcastle United", "Nottingham Forest", "Southampton", "Tottenham Hotspur", "West Ham United", "Wolverhampton Wanderers"
];

const gw1 = [
  "West Ham United", "Brighton & Hove Albion", "Crystal Palace", "Wolverhampton Wanderers", "Nottingham Forest", "Leeds United", "Everton", "Aston Villa", "Southampton", "Chelsea", "Newcastle United", "Brentford", "Tottenham Hotspur", "Manchester City", "Fulham", "Manchester United", "Arsenal", "Bournemouth", "Leicester City", "Liverpool"
];

const gw2 = [
  "Tottenham Hotspur", "Leicester City", "Brentford", "Aston Villa", "Southampton", "Bournemouth", "Liverpool", "Brighton & Hove Albion", "West Ham United", "Everton", "Fulham", "Crystal Palace", "Nottingham Forest", "Chelsea", "Manchester City", "Newcastle United", "Leeds United", "Wolverhampton Wanderers", "Manchester United", "Arsenal"
];

const gw3 = [
  "Wolverhampton Wanderers", "Crystal Palace", "Leeds United", "Arsenal", "Tottenham Hotspur", "Brighton & Hove Albion", "Everton", "Bournemouth", "Southampton", "Fulham", "Newcastle United", "Manchester City", "West Ham United", "Nottingham Forest", "Chelsea", "Leicester City", "Aston Villa", "Liverpool", "Manchester United", "Brentford"
];




// function shuffleArray(array) { // this randomises the array of teams
//   for (let i = array.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [array[i], array[j]] = [array[j], array[i]];
//   }
//   return array;
// }

// const randomTeams = shuffleArray(teams); // this is the randomised array of teams

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Welcome to the FPL Fixture Difficulty Ranker</h1>
      </header>
      <div className="sub-heading">
        <b><h2>2022/23 Fixtures</h2></b>
      </div>
      <div className = "cards">
        <CardList teams={teams} gw1={gw1} gw2={gw2} gw3={gw3}/>
      </div>
    </div>
  );
};

/*
TO-DO

- add club badges 
- display fixtures in a table
- add a search bar to filter fixtures
- import the FPL API
- colour code fixture difficulty
- add home and away display
- reorder table based on fixture difficulty

DONE:

- Add GW number to each fixture
- Add a dated ReadME

*/
import React from 'react';
import './App.css';
import CardList from '../cardlist/cardlist';

import MUNbadge from '../badges/MUNbadge.png';


const teams = [
  { name: "Arsenal", badge: null },
  { name: "Aston Villa", badge: null },
  { name: "Bournemouth", badge: null },
  { name: "Brentford", badge: null },
  { name: "Brighton & Hove Albion", badge: null },
  { name: "Chelsea", badge: null },
  { name: "Crystal Palace", badge: null },
  { name: "Everton", badge: null },
  { name: "Fulham", badge: null },
  { name: "Leicester City", badge: null },
  { name: "Leeds United", badge: null },
  { name: "Liverpool", badge: null },
  { name: "Manchester City", badge: null },
  { name: "Manchester United", badge: MUNbadge },
  { name: "Newcastle United", badge: null },
  { name: "Nottingham Forest", badge: null },
  { name: "Southampton", badge: null },
  { name: "Tottenham Hotspur", badge: null },
  { name: "West Ham United", badge: null },
  { name: "Wolverhampton Wanderers", badge: null }
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
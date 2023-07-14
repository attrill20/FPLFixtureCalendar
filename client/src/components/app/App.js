import React, { useState, useEffect } from "react";
import "./App.css";
import CardList from "../cardlist/cardlist";
import Dropdown from "../dropdown/dropdown";
import { teams, gameweeks } from "../dummy arrays/dummy";

// rendering the react elements
export default function App() {
  const [numberOfGameweeks, setNumberOfGameweeks] = useState(1);
  const [data, setData] = useState(null);
  const [fixturesData, setFixturesData] = useState(null);

  const handleGameweekChange = (event) => {
    setNumberOfGameweeks(event.target.value);
  };

  let filteredGameweeks = gameweeks.slice(0, numberOfGameweeks);

  useEffect(() => {
    async function fetchFPL() {
    const response = await fetch("http://localhost:3005")
    const data = await response.json();
    setData(data);
    setFixturesData(data.fixturesData)
    console.log(data);
    console.log(fixturesData);
  }
  fetchFPL()
}, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Welcome to the FPL Fixture Difficulty Calendar</h1>
      </header>
      <div className="sub-heading">
        <h2>
          Welcome to the Fixture Difficulty Planner for the 2023/24 Fixtures.
          You can use this site to filter teams by upcoming GWs to help plan
          transfers for players with easier fixtures and maximise your returns.
          Best of luck!
        </h2>
      </div>




      <div className='FPL-Stats'>
        {<h2>
          <p>Test: {data && data.bootstrapData.teams[0].name} - Short Name: {data && data.bootstrapData.teams[0].short_name} - Strength: {data && data.bootstrapData.teams[0].strength}</p>
          {/* <p>Test: {data && data.teams[19].name} - Short Name: {data && data.teams[19].short_name} - Strength: {data && data.teams[19].strength}</p>
          <p>Player Name: {data && data.elements[400].web_name} - Selected By: {data && data.elements[400].selected_by_percent}% - Total Points: {data && data.elements[400].total_points}</p>
          <p>Player Name: {data && data.elements[144].web_name} - Selected By: {data && data.elements[144].selected_by_percent}% - Total Points: {data && data.elements[144].total_points}</p>
          <p>Player Name: {data && data.elements[18].web_name} - Selected By: {data && data.elements[18].selected_by_percent}% - Total Points: {data && data.elements[18].total_points}</p>
          <img src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${data && data.elements[400].code}.png`} alt="text" />
          <img src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${data && data.elements[144].code}.png`} alt="text" />
          <img src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${data && data.elements[18].code}.png`} alt="text" /> */}
        </h2>}
        {<h2>
          <p>Fixture test: {data && fixturesData[0].team_h} v {data && fixturesData[0].team_a}</p>
        </h2>}
      </div>
      


      <div className="filter-container">
        <div className="gameweek-dropdown">
          <Dropdown handleGameweekChange={handleGameweekChange} />
        </div>
      </div>
      <div className="cards">
        <CardList teams={teams} gameweeks={filteredGameweeks} />
      </div>
    </div>
  );
}

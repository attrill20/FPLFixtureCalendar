import React, { useState, useEffect } from "react";
import "./App.css";
import CardList from "../cardlist/cardlist";
import Dropdown from "../dropdown/dropdown";
import { teams, gameweeks } from "../dummy arrays/dummy";

export default function App() {
  const [numberOfGameweeks, setNumberOfGameweeks] = useState(1);
  const [data, setData] = useState(null);
  const [mainData, setMainData] = useState(null);
  const [fixturesData, setFixturesData] = useState(null);
  const [targetWebName, setTargetWebName] = useState("");
  const [targetedPlayer, setTargetedPlayer] = useState(null);

  const handleGameweekChange = (event) => {
    setNumberOfGameweeks(event.target.value);
  };

  let filteredGameweeks = gameweeks.slice(0, numberOfGameweeks);

  let newTeams = [
    { id: 0, name: null },
    { id: 1, name: "Arsenal" },
    { id: 2, name: "Aston Villa" },
    { id: 3, name: "Bournemouth" },
    { id: 4, name: "Brentford" },
    { id: 5, name: "Brighton" },
    { id: 6, name: "Burnley" },
    { id: 7, name: "Chelsea" },
    { id: 8, name: "Crystal Palace" },
    { id: 9, name: "Everton" },
    { id: 10, name: "Fulham" },
    { id: 11, name: "Liverpool" },
    { id: 12, name: "Luton" },
    { id: 13, name: "Man City" },
    { id: 14, name: "Man Utd" },
    { id: 15, name: "Newcastle" },
    { id: 16, name: "Notts Forest" },
    { id: 17, name: "Sheffield Utd" },
    { id: 18, name: "Spurs" },
    { id: 19, name: "West Ham" },
    { id: 20, name: "Wolves" }
  ];


  function getFixturesForTeam(teamId, numberOfFixtures) {
      if (!fixturesData) return null; // Check to handle null fixturesData
    
    const teamFixtures = fixturesData.filter(
      fixture => fixture.team_h === teamId || fixture.team_a === teamId
    );
  
    // Calculate the total difficulty and return the requested number of fixtures
    const nextFixtures = teamFixtures.slice(0, numberOfFixtures).map(fixture => {
      const opponent = fixture.team_h === teamId ? newTeams[fixture.team_a].name : newTeams[fixture.team_h].name;
      const home = fixture.team_h === teamId;
      const difficulty = home ? fixture.team_h_difficulty : fixture.team_a_difficulty;
      return { opponent, home, difficulty };
    });
  
    // Calculate the total difficulty score
    const totalDifficulty = nextFixtures.reduce((acc, fixture) => acc + fixture.difficulty, 0);
    const reversedTotalDifficulty = (numberOfFixtures * 5) - totalDifficulty
  
    // Return the requested number of fixtures and the total difficulty
    return { fixtures: nextFixtures, totalDifficulty, reversedTotalDifficulty };
  }

  const arsenalFixtures = getFixturesForTeam(1, 5);
  const manUnitedFixtures = getFixturesForTeam(14, 5);
  // error below for Luton (should show a blank in GW2) - need to define the GWs and check for fixtures within that
  const lutonFixtures = getFixturesForTeam(12, 5);

  // Fetch the FPL API data
  useEffect(() => {
    async function fetchFPL() {
    const response = await fetch("http://localhost:3005")
    const data = await response.json();
    setData(data);
    setMainData(data.bootstrapData)
    setFixturesData(data.fixturesData)
    console.log(data);
  }
  fetchFPL()
}, []);

 // Function to target a player by their web name
 const findPlayerByWebName = () => {
  const lowercaseTargetWebName = targetWebName.toLowerCase();
  const targetedPlayer = mainData.elements.find(
    (player) => player.web_name.toLowerCase() === lowercaseTargetWebName
  );
  setTargetedPlayer(targetedPlayer);
};

// Handle input change for the web name
const handleInputChange = (event) => {
  setTargetWebName(event.target.value);
};

// Handle form submit
const handleSubmit = (event) => {
  event.preventDefault();
  findPlayerByWebName();
};


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
  {data && (
    <div>
      <p> Test: {mainData.teams[0].name} - Short Name: {mainData.teams[0].short_name} - Strength: {mainData.teams[0].strength} </p>
      <p>Test: {mainData.teams[19].name} - Short Name: {mainData.teams[19].short_name} - Strength: {mainData.teams[19].strength}</p>
      <p>Player Name: {mainData.elements[400].web_name} - Selected By: {mainData.elements[400].selected_by_percent}% - Total Points: {mainData.elements[400].total_points}</p>
      <p>Player Name: {mainData.elements[144].web_name} - Selected By: {mainData.elements[144].selected_by_percent}% - Total Points: {mainData.elements[144].total_points}</p>
      <p>Player Name: {mainData.elements[18].web_name} - Selected By: {mainData.elements[18].selected_by_percent}% - Total Points: {mainData.elements[18].total_points}</p>
      <img src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${451340}.png`} alt="Mitoma" />
      <img src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${176297}.png`} alt="Rashford" />
      <img src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${223340}.png`} alt="Saka" />
      <img src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${77794}.png`} alt="Trippier" />
      <img src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${172780}.png`} alt="Maddison" />
    </div>
  )}

 
  <form onSubmit={handleSubmit}>
  <h2>Player Searcher!</h2>
        <label>
          Type Player Name Here:
          <input type="text" value={targetWebName} onChange={handleInputChange} />
        </label>
        <button type="submit">Find Player</button>
      </form>

      {targetedPlayer ? (
        <div>
          <img src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${targetedPlayer.code}.png`}
            alt={targetedPlayer.web_name} />
          <p>Player Name: <strong>{targetedPlayer.web_name}</strong> </p>
          <p>Selected By: <strong>{targetedPlayer.selected_by_percent}%</strong></p>    
          <p>Total Points: <strong>{targetedPlayer.total_points}</strong></p>
        </div>
      ) : (
        <p>Player not found.</p>
      )}

      {data && (
  <div>
    <p>
      <strong>Friday night fixture: </strong>{newTeams[fixturesData[2].team_h].name} v {newTeams[fixturesData[2].team_a].name}
    </p>

    <h2>Arsenal's Next 5 Fixtures:</h2>
    <ul>
      {arsenalFixtures.fixtures.map(fixture => (
        <li key={fixture.opponent}>
          {fixture.opponent} <strong>({fixture.home ? 'H' : 'a'})</strong>
          - Difficulty: <strong>{fixture.difficulty}</strong>
        </li>
      ))}
    </ul>
    <p>Total Score: <strong>{arsenalFixtures.totalDifficulty} </strong> Reversed: <strong>{arsenalFixtures.reversedTotalDifficulty}</strong></p>

    <h2>Man United's Next 5 Fixtures:</h2>
    <ul>
      {manUnitedFixtures.fixtures.map(fixture => (
        <li key={fixture.opponent}>
          {fixture.opponent} <strong>({fixture.home ? 'H' : 'a'})</strong>
          - Difficulty: <strong>{fixture.difficulty}</strong>
        </li>
      ))}
    </ul>
    <p>Total Score: <strong>{manUnitedFixtures.totalDifficulty} </strong> Reversed: <strong>{manUnitedFixtures.reversedTotalDifficulty}</strong></p>

    <h2>Luton's Next 5 Fixtures:</h2>
    <ul>
      {lutonFixtures.fixtures.map(fixture => (
        <li key={fixture.opponent}>
          {fixture.opponent} <strong>({fixture.home ? 'H' : 'a'})</strong>
          - Difficulty: <strong>{fixture.difficulty}</strong>
        </li>
      ))}
    </ul>
    <p>Total Score: <strong>{lutonFixtures.totalDifficulty}</strong> Reversed: <strong>{lutonFixtures.reversedTotalDifficulty}</strong></p>
  </div>
)}

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

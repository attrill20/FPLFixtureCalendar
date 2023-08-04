import React, { useState, useEffect } from "react";
import "./App.css";
import CardList from "./components/cardlist/cardlist";
import PlayerSearcher from "./components/playerSearcher/playerSearcher";
import Dropdown from "./components/dropdown/dropdown";
import { teams } from "./components/dummyArrays/dummy";
// import { Routes, Route } from "react-router-dom";

export default function App() {
  const [numberOfGameweeks, setNumberOfGameweeks] = useState(5);
  const [data, setData] = useState(null);
  const [mainData, setMainData] = useState(null);
  const [fixturesData, setFixturesData] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc"); 

  const handleGameweekChange = (event) => {
    setNumberOfGameweeks(event.target.value);
  };

  function getFixturesForTeam(teamId, numberOfFixtures) {
    if (!fixturesData) {
      return { fixtures: [], totalDifficulty: 0, reversedTotalDifficulty: 0 };
    }
    
    const teamFixtures = fixturesData.filter(
      fixture => fixture.team_h === teamId || fixture.team_a === teamId
    );

    // Calculate the total difficulty and return the requested number of fixtures
    const nextFixtures = teamFixtures.slice(0, numberOfFixtures).map(fixture => {
      const opponent = fixture.team_h === teamId ? teams[fixture.team_a].name : teams[fixture.team_h].name;
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

const handleTableReorder = () => {
  setSortOrder((prevSortOrder) => (prevSortOrder === "asc" ? "desc" : "asc"));
};

const modifiedTeams = [];
for (const team of teams) {
  const { id } = team;
  const { reversedTotalDifficulty } = getFixturesForTeam(id, numberOfGameweeks);
  const modifiedTeam = { ...team, FDR: reversedTotalDifficulty };
  modifiedTeams.push(modifiedTeam);
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

   

    <div className="filter-container">
       <div className="gameweek-dropdown">
          <Dropdown handleGameweekChange={handleGameweekChange} />
        </div>
    </div>

        <button onClick={handleTableReorder}>
          Reorder Table by FDR {sortOrder === "asc" ? "↑" : "↓"}
        </button> 

      <div className="cards">
        <CardList
          teams={modifiedTeams} 
          fixturesData={fixturesData}
          numberOfGameweeks={numberOfGameweeks}
          sortOrder={sortOrder} 
        />
      </div>

      <div>
      <PlayerSearcher 
        data={data}
        mainData={mainData}
      />
    </div>
    
    </div>
  );
}
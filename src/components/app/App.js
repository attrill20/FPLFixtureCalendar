import React, { useState } from "react";
import "./App.css";
import CardList from "../cardlist/cardlist";
import Dropdown from "../dropdown/dropdown";
import { teams, gameweeks } from "../dummy arrays/dummy";

// rendering the react elements
export default function App() {
  const [numberOfGameweeks, setNumberOfGameweeks] = useState(1);

  const handleGameweekChange = (event) => {
    setNumberOfGameweeks(event.target.value);
  };

  let filteredGameweeks = gameweeks.slice(0, numberOfGameweeks);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Welcome to the FPL Fixture Difficulty Calendar</h1>
      </header>
      <div className="sub-heading">
        <h2>
          Welcome to the Fixture Difficulty Planner for the 2022/23 Fixtures.
          You can use this site to filter teams by upcoming GWs to help plan
          transfers for players with easier fixtures and maximise your returns.
          Best of luck!
        </h2>
      </div>
      <div class="filter-container">
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

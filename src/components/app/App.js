import React from 'react';
import './App.css';
import CardList from '../cardlist/cardlist';
import Dropdown from '../dropdown/dropdown';
import { teams, gw1, gw2, gw3 } from '../dummy arrays/dummy';

// rendering the react elements
export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Welcome to the FPL Fixture Difficulty Calendar</h1>
      </header>
      <div className="sub-heading">
        <h2>Welcome to the Fixture Difficulty Planner for the 2022/23 Fixtures. You can use this site to filter teams by upcoming GWs to help plan transfers for players with easier fixtures and maximise your returns. Best of luck!</h2>
      </div>
      <div class="filter-container">
        <div className="gameweek-dropdown">
          <Dropdown />
        </div>
      </div>
      <div className = "cards">
        <CardList teams={teams} gw1={gw1} gw2={gw2} gw3={gw3}/>
      </div>
    </div>
  );
};
import React from 'react';
import CardList from '../../components/cardlist/cardlist';
import "./FixtureCalendarPage.css"
import { Link } from 'react-router-dom';

const FixtureCalendarPage= ({ teams, fixturesData, activeGameweek }) => {
  return (
    <div>
    <header className="app-header">
        <h1>FPL Custom Fixture Difficulty</h1>
      </header>
      <div className="sub-heading">
        <h3>
         The table can be sorted using the buttons below using either the Official 1-5 FPL Difficulty or our 1-10 <a href="https://docs.google.com/spreadsheets/d/1wYS6wyRkHiP-9zlJAkd_V9vjnxXslpNinz-CLg6BILs/edit#gid=0" target="_blank" rel="noopener noreferrer">Custom Difficulty</a> to create a total FDR (fixture difficulty rating) for each team. Best of luck!
        </h3> 

        <div className='player-search-button'>
        Click here for the Player Searcher tool:
        <Link to="/search">
            <button >Player Searcher</button>
          </Link>
          </div>
      </div>

    <CardList teams={teams} fixturesData={fixturesData} activeGameweek={activeGameweek} />
    </div>
  );
};

export default FixtureCalendarPage;
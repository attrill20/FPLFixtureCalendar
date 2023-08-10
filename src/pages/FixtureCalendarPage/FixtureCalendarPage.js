import React from 'react';
import CardList from '../../components/cardlist/cardlist';
import "./FixtureCalendarPage.css"
import { Link } from 'react-router-dom';

const FixtureCalendarPage= ({ teams, fixturesData }) => {
  return (
    <div>
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

        <div className='player-search-button'>
        Click here to access the Player Searcher tool:
        <Link to="/search">
            <button >Player Searcher</button>
          </Link>
          </div>
      </div>

    <CardList teams={teams} fixturesData={fixturesData}  />
    </div>
  );
};

export default FixtureCalendarPage;
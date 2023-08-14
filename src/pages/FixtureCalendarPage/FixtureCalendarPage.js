import React from 'react';
import CardList from '../../components/cardlist/cardlist';
import "./FixtureCalendarPage.css"
import { Link } from 'react-router-dom';

const FixtureCalendarPage= ({ teams, fixturesData, mainData }) => {
  return (
    <div>
    <header className="app-header">
        <h1>Welcome to the FPL Fixture Difficulty Calendar</h1>
      </header>
      <div className="sub-heading">
        <h3>
          Use this table to sort teams by upcoming GWs to help plan
          transfers for players with easier fixtures and maximise your FPL returns. The table uses a unique calculation to create a total FDR (fixture difficulty rating) for each team. Best of luck!
        </h3> 

        <div className='player-search-button'>
        Click here to access the Player Searcher tool:
        <Link to="/search">
            <button >Player Searcher</button>
          </Link>
          </div>
      </div>

    <CardList teams={teams} fixturesData={fixturesData} mainData={mainData} />
    </div>
  );
};

export default FixtureCalendarPage;
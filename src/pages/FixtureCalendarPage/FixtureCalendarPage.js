import React from 'react';
import CardList from '../../components/cardlist/cardlist';
import "./FixtureCalendarPage.css"
import { Link } from 'react-router-dom';

const FixtureCalendarPage= ({ teams, fixturesData, activeGameweek }) => {
  return (
    <div>
      <div className="sub-heading">
        <p>
         The table can be sorted using the buttons below using either the Official 1-5 FPL Difficulty or our 1-10 <a href="https://docs.google.com/spreadsheets/d/1wYS6wyRkHiP-9zlJAkd_V9vjnxXslpNinz-CLg6BILs/edit#gid=0" target="_blank" rel="noopener noreferrer">Custom Difficulty</a> to create a total FDR (fixture difficulty rating) for each team. Best of luck!
        </p> 
      </div>

    <CardList teams={teams} fixturesData={fixturesData} activeGameweek={activeGameweek} />
    </div>
  );
};

export default FixtureCalendarPage;
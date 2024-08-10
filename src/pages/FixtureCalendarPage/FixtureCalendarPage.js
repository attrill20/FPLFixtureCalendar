import React from 'react';
import CardList from '../../components/cardlist/cardlist';
import "./FixtureCalendarPage.css"

const FixtureCalendarPage= ({ teams, fixturesData, activeGameweek }) => {
  return (
    <div>
      <div className="fixture-sub-heading">
        <p>
         The table can be sorted using the buttons below using either our custom 1-10 <a href="https://docs.google.com/spreadsheets/d/1wYS6wyRkHiP-9zlJAkd_V9vjnxXslpNinz-CLg6BILs/edit#gid=0" target="_blank" rel="noopener noreferrer">Oracle FDR</a> (Fixture Difficulty Rating) or the official 1-5 FPL FDR to display a total difficulty score for each team. Change the active gameweek to plan future transfers! 
        </p> 
      </div>

    <CardList teams={teams} fixturesData={fixturesData} activeGameweek={activeGameweek} />
    </div>
  );
};

export default FixtureCalendarPage;
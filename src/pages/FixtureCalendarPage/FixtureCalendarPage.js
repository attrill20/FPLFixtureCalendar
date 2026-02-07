import React from 'react';
import { Link } from 'react-router-dom';
import CardList from '../../components/cardlist/cardlist';
import "./FixtureCalendarPage.css"

const FixtureCalendarPage = ({ teams, fixturesData, activeGameweek }) => {
  return (
    <div>
      <div className="fixture-sub-heading">
        <p>
         The table can be sorted using the buttons below using either our custom 1-10 <Link to="/fdr-comparison">Oracle FDR</Link> (Fixture Difficulty Rating) or the official 1-5 FPL FDR to display a total difficulty score for each team. Change the active GW to plan future transfers!
        </p>
      </div>

    <CardList teams={teams} fixturesData={fixturesData} activeGameweek={activeGameweek} />
    </div>
  );
};

export default FixtureCalendarPage;
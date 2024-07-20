import React from 'react';
import "./HomePage.css";
import oracle_fpl_2 from '../../components/images/oracle_fpl_2.jpeg';

const HomePage = () => {
  return (
    <div>
      <header className="app-header">
        <h1>Welcome to OracleFPL</h1>
      </header>
      <div className="content">
        <img src={oracle_fpl_2} className="oracle-fpl-image" alt="OracleFPL" />
        <div className="sub-heading">
          <p>
            This is the homepage of the OracleFPL tools - we hope they hope you find them useful and improve your FPL rank! Use the Navbar above to select the tool you need.
          </p>
          <ul>
            <li><strong>Fixture Difficulty Calendar</strong></li>
            <li><strong>Player Searcher Tool</strong></li>
            <li><strong>FAQs</strong></li>
          </ul>
          <p>
            Good luck for the season ahead!
          </p>
        </div>
      </div>
      <div className="placeholder">
        <p>Placeholder text for additional information or content goes here.</p>
      </div>
    </div>
  );
};

export default HomePage;

import React from 'react';
import { Link } from 'react-router-dom';
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
        <div className="home-sub-heading">
          <p>
            This is the homepage of the OracleFPL tools - we hope they hope you find them useful and improve your FPL rank! Use the Navbar above to select the tool you need.
          </p>
          <ul>
            <li><Link to="/calendar"><strong>Fixture Difficulty Calendar</strong></Link></li>
            <li><Link to="/search"><strong>Player Searcher Tool</strong></Link></li>
            <li><Link to="/faqs"><strong>FAQs</strong></Link> (coming soon)</li>
          </ul>
          <p>
            Good luck for the season ahead!
          </p>
        </div>
      </div>
      <div className="placeholder">
        <p>Player of the week:</p>
      </div>
    </div>
  );
};

export default HomePage;

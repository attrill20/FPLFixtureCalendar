import React from 'react';
import { Link } from 'react-router-dom';
import "./HomePage.css";
import oracle_fpl_2 from '../../components/images/oracle_fpl_2.jpeg';
import july_2024_fdr from '../../components/images/july_2024_fdr.png'

const HomePage = () => {
  return (
    <div>
      <div className="content">
        <img src={oracle_fpl_2} className="oracle-fpl-image" alt="OracleFPL" />
        <header className="app-header">
          <h1>Welcome to OracleFPL!</h1>
          <h3><i>Crystal clear insights for FPL success</i></h3>
        </header>
      </div>
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
        <div className="fdr-wrapper">
          <div className="fdr-heading">  
            <h2>July 2024 FDR Update</h2>
            <p>Hello everyone, welcome back to a new season with OracleFPL! Southgate might not have brought it home, but hopefully with our tools you'll be bringing home your mini-league titles come May next year!</p>
            <p>The site has been updated with the new 24/25 fixtures and the inital FDR values. Here are some initial thoughts:</p>
            <ul>
              <li>Man City, Arsenal and Liverpool retain their strong scores from the end of last season, although none judged high enough for a 10 score currently based on their PPG. Liverpool's patchy away record is recognised and could drop further under new manager Arne Slot.</li>
              <li>Recently promoted teams Ipswich Town, Leicester City and Southampton all are given the same ratings (H:2, A:3), due to being the 3 favourites for relegation. Early results may give us an indication for how each will fare in this current season and if any adjustments are needed.</li>
              <li>Newcastle United and Chelsea have the current largest gaps between home and away FDR, due to their large discrepancies last season. Brentford are the only team that start the season with equal ratings (H:3, A:3) due to their poor form last season, but this will be amended if they show signs of their stronger home form from previous seasons.</li>
            </ul>
            <p>If there are any major transfers or clear indications of form in pre-season friendlies, then these figures will be updated - but hopefully these should give a much fuller picture of the early fixture calendar. We'll break that down and post our recommendations in a future post - happy planning!</p>
          </div>
          <img src={july_2024_fdr} className="fdr-image" alt="fdr-image" />
        </div>
    </div>
  );
};

export default HomePage;

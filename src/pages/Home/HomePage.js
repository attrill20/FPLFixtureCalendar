import React from 'react';
import "./HomePage.css"
import { Link } from 'react-router-dom';
import oracle_fpl_3 from '../../components/images/oracle_fpl_3.jpeg';

const HomePage= () => {
  return (
    <div>
    <header className="app-header">
        <h1>Welcome to OracleFPL</h1>
      </header>
      <div className="sub-heading">
        <img src={oracle_fpl_3} className="oracle-fpl-image" alt="OracleFPL" />
        <h3>
         This is the homepage of the OracleFPL tools - we hope they hope you find them useful and improve your FPL rank! Use the Navbar above to select the tool you need.
        </h3> 
      </div>
    </div>
  );
};

export default HomePage;
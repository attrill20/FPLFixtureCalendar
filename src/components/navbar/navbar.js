import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <NavLink to="/home" className="navbar-left">
        <span className="navbar-brand anton-regular">OracleFPL</span>
      </NavLink>
      <div className="navbar-menu-container">
        <ul className={`navbar-menu ${isOpen ? 'open' : ''}`}>
          <li><NavLink to="/" activeClassName="active" onClick={toggleMenu}>Home</NavLink></li>
          <li><NavLink to="/calendar" activeClassName="active" onClick={toggleMenu}>Fixture Difficulty Calendar</NavLink></li>
          <li><NavLink to="/comparison" activeClassName="active" onClick={toggleMenu}>Player Comparison</NavLink></li>
          <li><NavLink to="/top10" activeClassName="active" onClick={toggleMenu}>Top 10s</NavLink></li>
          <li><NavLink to="/faq" activeClassName="active" onClick={toggleMenu}>FAQs</NavLink></li>
        </ul>
      </div>
      <button className="navbar-toggler" onClick={toggleMenu}>
        &#9776; {/* Hamburger icon */}
      </button>
    </nav>
  );
}

export default Navbar;

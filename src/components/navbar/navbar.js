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
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => isActive ? 'active' : ''} 
              onClick={toggleMenu}
            >
            Home
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/calendar" 
              className={({ isActive }) => isActive ? 'active' : ''} 
              onClick={toggleMenu}
            >
            Fixture Difficulty Calendar
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/comparison" 
              className={({ isActive }) => isActive ? 'active' : ''} 
              onClick={toggleMenu}
            >
            Player Comparison
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/top10" 
              className={({ isActive }) => isActive ? 'active' : ''} 
              onClick={toggleMenu}
            >
            Player Stats
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/teams" 
              className={({ isActive }) => isActive ? 'active' : ''} 
              onClick={toggleMenu}
            >
            Team Stats
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/faq" 
              className={({ isActive }) => isActive ? 'active' : ''} 
              onClick={toggleMenu}
            >
              FAQs
            </NavLink>
          </li>
        </ul>
      </div>
      <button className="navbar-toggler" onClick={toggleMenu}>
        &#9776; {/* Hamburger icon */}
      </button>
    </nav>
  );
}

export default Navbar;

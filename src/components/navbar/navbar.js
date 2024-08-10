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
      <button className="navbar-toggler" onClick={toggleMenu}>
        &#9776; {/* Hamburger icon */}
      </button>
      <ul className={`navbar-menu ${isOpen ? 'open' : ''}`}>
        <li><NavLink exact to="/home" activeClassName="active" onClick={toggleMenu}>Home</NavLink></li>
        <li><NavLink exact to="/calendar" activeClassName="active" onClick={toggleMenu}>Fixture Difficulty Calendar</NavLink></li>
        <li><NavLink exact to="/comparison" activeClassName="active" onClick={toggleMenu}>Player Comparison</NavLink></li>
      </ul>
    </nav>
  );
}

export default Navbar;

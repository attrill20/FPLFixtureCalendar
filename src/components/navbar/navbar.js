import React from 'react';
import { NavLink } from 'react-router-dom';
import './navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <ul>
        <li><NavLink exact to="/home" activeClassName="active">Home</NavLink></li>
        <li><NavLink exact to="/calendar" activeClassName="active">Fixture Difficulty Calendar</NavLink></li>
        <li><NavLink exact to="/comparison" activeClassName="active">Player Comparison</NavLink></li>
      </ul>
    </nav>
  );
}

export default Navbar;

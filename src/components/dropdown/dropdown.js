import React from "react";
import "./dropdown.css";

export default function Dropdown({ handleGameweekChange }) {
  return (
    <select id="gameweek-dropdown" onChange={handleGameweekChange} defaultValue="5">
      <option value="1">1 Gameweek</option>
      <option value="2">2 Gameweeks</option>
      <option value="3">3 Gameweeks</option>
      <option value="4">4 Gameweeks</option>
      <option value="5">5 Gameweeks</option>
      <option value="6">6 Gameweeks</option>
      <option value="7">7 Gameweeks</option>
      <option value="8">8 Gameweeks</option>
      <option value="9">9 Gameweeks</option>
      <option value="10">10 Gameweeks</option>
      {/* <option value="38">38 Gameweeks</option> */}
    </select>
  );
}

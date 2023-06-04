import React from "react";

export default function Dropdown({ handleGameweekChange }) {
  return (
    <select id="gameweek-dropdown" onChange={handleGameweekChange}>
      <option value="1">1 Gameweek</option>
      <option value="2">2 Gameweeks</option>
      <option value="3">3 Gameweeks</option>
    </select>
  );
}

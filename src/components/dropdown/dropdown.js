import React from "react";
import "./dropdown.css";

export default function Dropdown({ handleGameweekChange, activeGameweek }) {
  // Calculate the number of remaining gameweeks until Gameweek 38
  const remainingGameweeks = 38 - activeGameweek + 1;
  
  // Set the default value based on remaining gameweeks
  const defaultValue = remainingGameweeks >= 5 ? "5" : String(remainingGameweeks);

  return (
    <select id="gameweek-dropdown" onChange={handleGameweekChange} defaultValue={defaultValue}>
      {remainingGameweeks >= 10 && <option value="10">10 Gameweeks</option>}
      {remainingGameweeks >= 9 && <option value="9">9 Gameweeks</option>}
      {remainingGameweeks >= 8 && <option value="8">8 Gameweeks</option>}
      {remainingGameweeks >= 7 && <option value="7">7 Gameweeks</option>}
      {remainingGameweeks >= 6 && <option value="6">6 Gameweeks</option>}
      {remainingGameweeks >= 5 && <option value="5">5 Gameweeks</option>}
      {remainingGameweeks >= 4 && <option value="4">4 Gameweeks</option>}
      {remainingGameweeks >= 3 && <option value="3">3 Gameweeks</option>}
      {remainingGameweeks >= 2 && <option value="2">2 Gameweeks</option>}
      {remainingGameweeks >= 1 && <option value="1">1 Gameweek</option>}
    </select>
  );
}

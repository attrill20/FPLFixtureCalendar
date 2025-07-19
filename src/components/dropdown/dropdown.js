import React, { useState, useEffect } from "react";
import "./dropdown.css";

export default function Dropdown({ handleGameweekChange, activeGameweek }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1200);

  // Listen for window resize to update mobile state
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1200);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate the number of remaining gameweeks until Gameweek 38
  const remainingGameweeks = 38 - activeGameweek + 1;
  
  // Set the default value based on remaining gameweeks
  const defaultValue = remainingGameweeks >= 5 ? "5" : String(remainingGameweeks);

  // Function to get text based on screen size
  const getText = (num) => {
    if (isMobile) {
      return num === 1 ? `${num} GW` : `${num} GWs`;
    }
    return num === 1 ? `${num} Gameweek` : `${num} Gameweeks`;
  };

  return (
    <select id="gameweek-dropdown" onChange={handleGameweekChange} defaultValue={defaultValue}>
      {remainingGameweeks >= 10 && <option value="10">{getText(10)}</option>}
      {remainingGameweeks >= 9 && <option value="9">{getText(9)}</option>}
      {remainingGameweeks >= 8 && <option value="8">{getText(8)}</option>}
      {remainingGameweeks >= 7 && <option value="7">{getText(7)}</option>}
      {remainingGameweeks >= 6 && <option value="6">{getText(6)}</option>}
      {remainingGameweeks >= 5 && <option value="5">{getText(5)}</option>}
      {remainingGameweeks >= 4 && <option value="4">{getText(4)}</option>}
      {remainingGameweeks >= 3 && <option value="3">{getText(3)}</option>}
      {remainingGameweeks >= 2 && <option value="2">{getText(2)}</option>}
      {remainingGameweeks >= 1 && <option value="1">{getText(1)}</option>}
    </select>
  );
}

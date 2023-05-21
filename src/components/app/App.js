import React from 'react';
import './App.css';
import CardList from '../cardlist/cardlist';

// import badges
import ARSbadge from '../badges/ARSbadge.png'
import AVLbadge from '../badges/AVLbadge.png'
import BOUbadge from '../badges/BOUbadge.png'
import BREbadge from '../badges/BREbadge.png'
import BHAbadge from '../badges/BHAbadge.png'
import CHEbadge from '../badges/CHEbadge.png'
import CRYbadge from '../badges/CRYbadge.png'
import EVEbadge from '../badges/EVEbadge.png'
import FULbadge from '../badges/FULbadge.png'
import LEIbadge from '../badges/LEIbadge.png'
import LEEbadge from '../badges/LEEbadge.png'
import LIVbadge from '../badges/LIVbadge.png'
import MCIbadge from '../badges/MCIbadge.png'
import MUNbadge from '../badges/MUNbadge.png'
import NEWbadge from '../badges/NEWbadge.png'
import NFObadge from '../badges/NFObadge.png'
import SOUbadge from '../badges/SOUbadge.png'
import TOTbadge from '../badges/TOTbadge.png'
import WHUbadge from '../badges/WHUbadge.png'
import WOLbadge from '../badges/WOLbadge.png'

// array of teams
const teams = [
  { name: "Arsenal", initial: "ARS", badge: ARSbadge },
  { name: "Aston Villa", initial: "AVL", badge: AVLbadge },
  { name: "Bournemouth", initial: "BOU", badge: BOUbadge },
  { name: "Brentford", initial: "BRE", badge: BREbadge },
  { name: "Brighton & Hove Albion", initial: "BHA", badge: BHAbadge },
  { name: "Chelsea", initial: "CHE", badge: CHEbadge },
  { name: "Crystal Palace", initial: "CRY", badge: CRYbadge },
  { name: "Everton", initial: "EVE", badge: EVEbadge },
  { name: "Fulham", initial: "FUL", badge: FULbadge },
  { name: "Leicester City", initial: "LEI", badge: LEIbadge },
  { name: "Leeds United", initial: "LEE", badge: LEEbadge },
  { name: "Liverpool", initial: "LIV", badge: LIVbadge },
  { name: "Manchester City", initial: "MCI", badge: MCIbadge },
  { name: "Manchester United", initial: "MUN", badge: MUNbadge },
  { name: "Newcastle United", initial: "NEW", badge: NEWbadge },
  { name: "Nottingham Forest", initial: "NFO", badge: NFObadge },
  { name: "Southampton", initial: "SOU", badge: SOUbadge },
  { name: "Tottenham Hotspur", initial: "TOT", badge: TOTbadge },
  { name: "West Ham United", initial: "WHU", badge: WHUbadge },
  { name: "Wolverhampton Wanderers", initial: "WOL", badge: WOLbadge }
];

// dummy gw arrays
const gw1 = [
  { name: "Bournemouth", initial: "BOU", badge: BOUbadge },
  { name: "Tottenham Hotspur", initial: "TOT", badge: TOTbadge },
  { name: "Nottingham Forest", initial: "NFO", badge: NFObadge },
  { name: "Manchester City", initial: "MCI", badge: MCIbadge },
  { name: "Fulham", initial: "FUL", badge: FULbadge },
  { name: "Wolverhampton Wanderers", initial: "WOL", badge: WOLbadge },
  { name: "Leeds United", initial: "LEE", badge: LEEbadge },
  { name: "West Ham United", initial: "WHU", badge: WHUbadge },
  { name: "Leicester City", initial: "LEI", badge: LEIbadge },
  { name: "Newcastle United", initial: "NEW", badge: NEWbadge },
  { name: "Chelsea", initial: "CHE", badge: CHEbadge },
  { name: "Liverpool", initial: "LIV", badge: LIVbadge },
  { name: "Southampton", initial: "SOU", badge: SOUbadge },
  { name: "Brighton & Hove Albion", initial: "BHA", badge: BHAbadge },
  { name: "Crystal Palace", initial: "CRY", badge: CRYbadge },
  { name: "Aston Villa", initial: "AVL", badge: AVLbadge },
  { name: "Manchester United", initial: "MUN", badge: MUNbadge },
  { name: "Arsenal", initial: "ARS", badge: ARSbadge },
  { name: "Everton", initial: "EVE", badge: EVEbadge },
  { name: "Brentford", initial: "BRE", badge: BREbadge }
];

const gw2 = [
  { name: "Tottenham Hotspur", initial: "TOT", badge: TOTbadge },
  { name: "Leicester City", initial: "LEI", badge: LEIbadge },
  { name: "Brentford", initial: "BRE", badge: BREbadge },
  { name: "Aston Villa", initial: "AVL", badge: AVLbadge },
  { name: "Southampton", initial: "SOU", badge: SOUbadge },
  { name: "Bournemouth", initial: "BOU", badge: BOUbadge },
  { name: "Liverpool", initial: "LIV", badge: LIVbadge },
  { name: "Brighton & Hove Albion", initial: "BHA", badge: BHAbadge },
  { name: "West Ham United", initial: "WHU", badge: WHUbadge },
  { name: "Everton", initial: "EVE", badge: EVEbadge },
  { name: "Fulham", initial: "FUL", badge: FULbadge },
  { name: "Crystal Palace", initial: "CRY", badge: CRYbadge },
  { name: "Nottingham Forest", initial: "NFO", badge: NFObadge },
  { name: "Chelsea", initial: "CHE", badge: CHEbadge },
  { name: "Manchester City", initial: "MCI", badge: MCIbadge },
  { name: "Newcastle United", initial: "NEW", badge: NEWbadge },
  { name: "Leeds United", initial: "LEE", badge: LEEbadge },
  { name: "Wolverhampton Wanderers", initial: "WOL", badge: WOLbadge },
  { name: "Manchester United", initial: "MUN", badge: MUNbadge },
  { name: "Arsenal", initial: "ARS", badge: ARSbadge }
];

const gw3 = [
  { name: "Manchester United", initial: "MUN", badge: MUNbadge },
  { name: "Manchester City", initial: "MCI", badge: MCIbadge },
  { name: "Liverpool", initial: "LIV", badge: LIVbadge },
  { name: "Chelsea", initial: "CHE", badge: CHEbadge },
  { name: "Arsenal", initial: "ARS", badge: ARSbadge },
  { name: "Tottenham Hotspur", initial: "TOT", badge: TOTbadge },
  { name: "Leicester City", initial: "LEI", badge: LEIbadge },
  { name: "West Ham United", initial: "WHU", badge: WHUbadge },
  { name: "Everton", initial: "EVE", badge: EVEbadge },
  { name: "Leeds United", initial: "LEE", badge: LEEbadge },
  { name: "Aston Villa", initial: "AVL", badge: AVLbadge },
  { name: "Wolverhampton Wanderers", initial: "WOL", badge: WOLbadge },
  { name: "Newcastle United", initial: "NEW", badge: NEWbadge },
  { name: "Crystal Palace", initial: "CRY", badge: CRYbadge },
  { name: "Southampton", initial: "SOU", badge: SOUbadge },
  { name: "Brighton & Hove Albion", initial: "BHA", badge: BHAbadge },
  { name: "Fulham", initial: "FUL", badge: FULbadge },
  { name: "Brentford", initial: "BRE", badge: BREbadge },
  { name: "Bournemouth", initial: "BOU", badge: BOUbadge },
  { name: "Nottingham Forest", initial: "NFO", badge: NFObadge }
];




// rendering the react elements
export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Welcome to the FPL Fixture Difficulty Calendar</h1>
      </header>
      <div className="sub-heading">
        <h2>Welcome to the Fixture Difficulty Planner for the 2022/23 Fixtures. You can use this site to filter teams by upcoming GWs to help plan transfers for players with easier fixtures and maximise your returns. Best of luck!</h2>
      </div>
      <div className = "cards">
        <CardList teams={teams} gw1={gw1} gw2={gw2} gw3={gw3}/>
      </div>
    </div>
  );
};
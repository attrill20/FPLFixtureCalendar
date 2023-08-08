// import badges
import ARSbadge from '../badges/ARSbadge.png'
import AVLbadge from '../badges/AVLbadge.png'
import BOUbadge from '../badges/BOUbadge.png'
import BREbadge from '../badges/BREbadge.png'
import BHAbadge from '../badges/BHAbadge.png'
import BURbadge from '../badges/BURbadge.png'
import CHEbadge from '../badges/CHEbadge.png'
import CRYbadge from '../badges/CRYbadge.png'
import EVEbadge from '../badges/EVEbadge.png'
import FULbadge from '../badges/FULbadge.png'
import LEIbadge from '../badges/LEIbadge.png'
import LEEbadge from '../badges/LEEbadge.png'
import LIVbadge from '../badges/LIVbadge.png'
import LUTbadge from '../badges/LUTbadge.png'
import MCIbadge from '../badges/MCIbadge.png'
import MUNbadge from '../badges/MUNbadge.png'
import NEWbadge from '../badges/NEWbadge.png'
import NFObadge from '../badges/NFObadge.png'
import SHUbadge from '../badges/SHUbadge.png'
import SOUbadge from '../badges/SOUbadge.png'
import TOTbadge from '../badges/TOTbadge.png'
import WHUbadge from '../badges/WHUbadge.png'
import WOLbadge from '../badges/WOLbadge.png'

// array of teams
export const teams = [
  { id: 0, name: "Blank", initial: "NULL", badge: null },
  { id: 1, name: "Arsenal", initial: "ARS", badge: ARSbadge },
  { id: 2, name: "Aston Villa", initial: "AVL", badge: AVLbadge },
  { id: 3, name: "Bournemouth", initial: "BOU", badge: BOUbadge },
  { id: 4, name: "Brentford", initial: "BRE", badge: BREbadge },
  { id: 5, name: "Brighton", initial: "BHA", badge: BHAbadge },
  { id: 6, name: "Burnley", initial: "BUR", badge: BURbadge },
  { id: 7, name: "Chelsea", initial: "CHE", badge: CHEbadge },
  { id: 8, name: "Crystal Palace", initial: "CRY", badge: CRYbadge },
  { id: 9, name: "Everton", initial: "EVE", badge: EVEbadge },
  { id: 10, name: "Fulham", initial: "FUL", badge: FULbadge },
  // { name: "Leicester City", initial: "LEI", badge: LEIbadge },
  // { name: "Leeds United", initial: "LEE", badge: LEEbadge },
  { id: 11, name: "Liverpool", initial: "LIV", badge: LIVbadge },
  { id: 12, name: "Luton", initial: "LUT", badge: LUTbadge },
  { id: 13, name: "Man City", initial: "MCI", badge: MCIbadge },
  { id: 14, name: "Man Utd", initial: "MUN", badge: MUNbadge },
  { id: 15, name: "Newcastle", initial: "NEW", badge: NEWbadge },
  { id: 16, name: "Notts Forest", initial: "NFO", badge: NFObadge },
  // { name: "Southampton", initial: "SOU", badge: SOUbadge },
  { id: 17, name: "Sheffield Utd", initial: "SHU", badge: SHUbadge },
  { id: 18, name: "Spurs", initial: "TOT", badge: TOTbadge },
  { id: 19, name: "West Ham", initial: "WHU", badge: WHUbadge },
  { id: 20, name: "Wolves", initial: "WOL", badge: WOLbadge },
  // { id: 21, name: "Blank", initial: "NULL", badge: "Null badge" },
];

// dummy gw arrays
export const gw1 = [
  { name: "Bournemouth", initial: "BOU", badge: BOUbadge, location: '(H)' },
  { name: "Tottenham Hotspur", initial: "TOT", badge: TOTbadge, location: '(a)' },
  { name: "Nottingham Forest", initial: "NFO", badge: NFObadge, location: '(H)' },
  { name: "Manchester City", initial: "MCI", badge: MCIbadge, location: '(H)' },
  { name: "Fulham", initial: "FUL", badge: FULbadge, location: '(a)' },
  { name: "Wolverhampton Wanderers", initial: "WOL", badge: WOLbadge, location: '(a)' },
  { name: "Leeds United", initial: "LEE", badge: LEEbadge, location: '(H)' },
  { name: "West Ham United", initial: "WHU", badge: WHUbadge, location: '(a)' },
  { name: "Leicester City", initial: "LEI", badge: LEIbadge, location: '(a)' },
  { name: "Newcastle United", initial: "NEW", badge: NEWbadge, location: '(H)' },
  { name: "Chelsea", initial: "CHE", badge: CHEbadge, location: '(H)' },
  { name: "Southampton", initial: "SOU", badge: SOUbadge, location: '(a)' },
  { name: "Liverpool", initial: "LIV", badge: LIVbadge, location: '(H)' },
  { name: "Brighton & Hove Albion", initial: "BHA", badge: BHAbadge, location: '(H)' },
  { name: "Crystal Palace", initial: "CRY", badge: CRYbadge, location: '(a)' },
  { name: "Aston Villa", initial: "AVL", badge: AVLbadge, location: '(a)' },
  { name: "Manchester United", initial: "MUN", badge: MUNbadge, location: '(H)' },
  { name: "Arsenal", initial: "ARS", badge: ARSbadge, location: '(H)' },
  { name: "Everton", initial: "EVE", badge: EVEbadge, location: '(a)' },
  { name: "Brentford", initial: "BRE", badge: BREbadge, location: '(a)' }
];

export const gw2 = [
    { name: 'Tottenham Hotspur', initial: 'TOT', badge: TOTbadge, location: '(H)' },
    { name: 'Leicester City', initial: 'LEI', badge: LEIbadge, location: '(a)' },
    { name: 'Brentford', initial: 'BRE', badge: BREbadge, location: '(a)' },
    { name: 'Aston Villa', initial: 'AVL', badge: AVLbadge, location: '(H)' },
    { name: 'Southampton', initial: 'SOU', badge: SOUbadge, location: '(a)' },
    { name: 'Bournemouth', initial: 'BOU', badge: BOUbadge, location: '(H)' },
    { name: 'Liverpool', initial: 'LIV', badge: LIVbadge, location: '(H)' },
    { name: 'Brighton & Hove Albion', initial: 'BHA', badge: BHAbadge, location: '(H)' },
    { name: 'West Ham United', initial: 'WHU', badge: WHUbadge, location: '(a)' },
    { name: 'Everton', initial: 'EVE', badge: EVEbadge, location: '(a)' },
    { name: 'Fulham', initial: 'FUL', badge: FULbadge, location: '(a)' },
    { name: 'Crystal Palace', initial: 'CRY', badge: CRYbadge, location: '(a)' },
    { name: 'Nottingham Forest', initial: 'NFO', badge: NFObadge, location: '(H)' },
    { name: 'Chelsea', initial: 'CHE', badge: CHEbadge, location: '(H)' },
    { name: 'Manchester City', initial: 'MCI', badge: MCIbadge, location: '(H)' },
    { name: 'Newcastle United', initial: 'NEW', badge: NEWbadge, location: '(H)' },
    { name: 'Leeds United', initial: 'LEE', badge: LEEbadge, location: '(H)' },
    { name: 'Wolverhampton Wanderers', initial: 'WOL', badge: WOLbadge, location: '(a)' },
    { name: 'Manchester United', initial: 'MUN', badge: MUNbadge, location: '(H)' },
    { name: 'Arsenal', initial: 'ARS', badge: ARSbadge, location: '(H)' }
];

export const gw3 = [
    { name: 'Manchester United', initial: 'MUN', badge: MUNbadge, location: '(H)' },
    { name: 'Manchester City', initial: 'MCI', badge: MCIbadge, location: '(H)' },
    { name: 'Liverpool', initial: 'LIV', badge: LIVbadge, location: '(H)' },
    { name: 'Chelsea', initial: 'CHE', badge: CHEbadge, location: '(H)' },
    { name: 'Arsenal', initial: 'ARS', badge: ARSbadge, location: '(H)' },
    { name: 'Tottenham Hotspur', initial: 'TOT', badge: TOTbadge, location: '(a)' },
    { name: 'Leicester City', initial: 'LEI', badge: LEIbadge, location: '(a)' },
    { name: 'West Ham United', initial: 'WHU', badge: WHUbadge, location: '(a)' },
    { name: 'Everton', initial: 'EVE', badge: EVEbadge, location: '(a)' },
    { name: 'Leeds United', initial: 'LEE', badge: LEEbadge, location: '(H)' },
    { name: 'Aston Villa', initial: 'AVL', badge: AVLbadge, location: '(a)' },
    { name: 'Wolverhampton Wanderers', initial: 'WOL', badge: WOLbadge, location: '(a)' },
    { name: 'Newcastle United', initial: 'NEW', badge: NEWbadge, location: '(H)' },
    { name: 'Crystal Palace', initial: 'CRY', badge: CRYbadge, location: '(a)' },
    { name: 'Southampton', initial: 'SOU', badge: SOUbadge, location: '(a)' },
    { name: 'Brighton & Hove Albion', initial: 'BHA', badge: BHAbadge, location: '(H)' },
    { name: 'Fulham', initial: 'FUL', badge: FULbadge, location: '(a)' },
    { name: 'Brentford', initial: 'BRE', badge: BREbadge, location: '(a)' },
    { name: 'Bournemouth', initial: 'BOU', badge: BOUbadge, location: '(H)' },
    { name: 'Nottingham Forest', initial: 'NFO', badge: NFObadge, location: '(H)' }
];

export const gameweeks = [gw1, gw2, gw3]
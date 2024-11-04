// import badges
import ARSbadge from '../badges/ARSbadge.png'
import AVLbadge from '../badges/AVLbadge.png'
import BOUbadge from '../badges/BOUbadge.png'
import BREbadge from '../badges/BREbadge.png'
import BHAbadge from '../badges/BHAbadge.png'
// import BURbadge from '../badges/BURbadge.png'
import CHEbadge from '../badges/CHEbadge.png'
import CRYbadge from '../badges/CRYbadge.png'
import EVEbadge from '../badges/EVEbadge.png'
import FULbadge from '../badges/FULbadge.png'
import IPSbadge from '../badges/IPSbadge.png'
import LEIbadge from '../badges/LEIbadge.png'
// import LEEbadge from '../badges/LEEbadge.png'
// import LIVbadge from '../badges/LIVbadge.png'
import LIVbadge2 from '../badges/LIVbadge2.png'
// import LUTbadge from '../badges/LUTbadge.png'
import MCIbadge from '../badges/MCIbadge.png'
import MUNbadge from '../badges/MUNbadge.png'
import NEWbadge from '../badges/NEWbadge.png'
import NFObadge from '../badges/NFObadge.png'
// import SHUbadge from '../badges/SHUbadge.png'
import SOUbadge from '../badges/SOUbadge.png'
import TOTbadge from '../badges/TOTbadge.png'
import WHUbadge from '../badges/WHUbadge.png'
import WOLbadge from '../badges/WOLbadge.png'

import axios from 'axios';

export let teams = [
  { id: 0, name: "Blank", initial: "NULL", badge: null, h_diff: 11, a_diff: 11 },
  { id: 1, name: "Arsenal", initial: "ARS", badge: ARSbadge, h_diff: 8, a_diff: 9, code: 3 },
  { id: 2, name: "Aston Villa", initial: "AVL", badge: AVLbadge, h_diff: 5, a_diff: 10, code: 7 },
  { id: 3, name: "Bournemouth", initial: "BOU", badge: BOUbadge, h_diff: 4, a_diff: 4, code: 91 },
  { id: 4, name: "Brentford", initial: "BRE", badge: BREbadge, h_diff: 3, a_diff: 6, code: 94 },
  { id: 5, name: "Brighton", initial: "BHA", badge: BHAbadge, h_diff: 5, a_diff: 7, code: 36 },
  // { id: 6, name: "Burnley", initial: "BUR", badge: BURbadge, h_diff: 2, a_diff: 1 },
  { id: 6, name: "Chelsea", initial: "CHE", badge: CHEbadge, h_diff: 5, a_diff: 4, code: 8 },
  { id: 7, name: "Crystal Palace", initial: "CRY", badge: CRYbadge, h_diff: 5, a_diff: 2, code: 31 },
  { id: 8, name: "Everton", initial: "EVE", badge: EVEbadge, h_diff: 6, a_diff: 3, code: 11 },
  { id: 9, name: "Fulham", initial: "FUL", badge: FULbadge, h_diff: 3, a_diff: 6, code: 54 },
  { id: 10, name: "Ipswich", initial: "IPS", badge: IPSbadge, h_diff: 3, a_diff: 6, code: 40 },
  { id: 11, name: "Leicester", initial: "LEI", badge: LEIbadge, h_diff: 3, a_diff: 6, code: 13 },
  // { name: "Leeds United", initial: "LEE", badge: LEEbadge },
  { id: 12, name: "Liverpool", initial: "LIV", badge: LIVbadge2, h_diff: 7, a_diff: 10, code: 14 },
  // { id: 13, name: "Luton", initial: "LUT", badge: LUTbadge, h_diff: 2, a_diff: 2 },
  { id: 13, name: "Man City", initial: "MCI", badge: MCIbadge, h_diff: 7, a_diff: 9, code: 43 },
  { id: 14, name: "Man United", initial: "MUN", badge: MUNbadge, h_diff: 6, a_diff: 6, code: 1 },
  { id: 15, name: "Newcastle", initial: "NEW", badge: NEWbadge, h_diff: 3, a_diff: 9, code: 4 },
  { id: 16, name: "Notts Forest", initial: "NFO", badge: NFObadge, h_diff: 2, a_diff: 4, code: 17 },
  { id: 17, name: "Southampton", initial: "SOU", badge: SOUbadge, h_diff: 3, a_diff: 6, code: 20 },
  // { id: 17, name: "Sheffield Utd", initial: "SHU", badge: SHUbadge, h_diff: 1, a_diff: 4 },
  { id: 18, name: "Spurs", initial: "TOT", badge: TOTbadge, h_diff: 7, a_diff: 6, code: 6 },
  { id: 19, name: "West Ham", initial: "WHU", badge: WHUbadge, h_diff: 6, a_diff: 5, code: 21 },
  { id: 20, name: "Wolves", initial: "WOL", badge: WOLbadge, h_diff: 3, a_diff: 5, code: 39 },
  // { id: 21, name: "Blank", initial: "NULL", badge: "Null badge" },
];

const fetchDataFromGoogleSheets = async () => {
  try {
    const spreadsheetId = process.env.REACT_APP_SPREADSHEET_ID;
    const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
    const sheetName = process.env.REACT_APP_SHEET_NAME;

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}?key=${apiKey}`;

    const response = await axios.get(url);
    const data = response.data.values;

    for (let i = 1; i <= 20; i++) {
      teams[i].h_diff = parseInt(data[i + 3][2]); 
      teams[i].a_diff = parseInt(data[i + 3][3]); 
    }

  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
  }
};

fetchDataFromGoogleSheets();
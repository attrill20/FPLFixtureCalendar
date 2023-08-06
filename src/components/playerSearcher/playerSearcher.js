import React, { useState } from "react";
import "./playerSearcher.css";

export default function PlayerSearcher({ data, mainData }) {

const [targetedPlayer, setTargetedPlayer] = useState(null);   
const [targetWebName, setTargetWebName] = useState("");

// Function to target a player by their web name
const findPlayerByWebName = () => {
    const lowercaseTargetWebName = targetWebName.toLowerCase();
    const targetedPlayer = mainData.elements.find(
      (player) => player.web_name.toLowerCase() === lowercaseTargetWebName
    );
    setTargetedPlayer(targetedPlayer);
  };
  
  // Handle input change for the web name
  const handleInputChange = (event) => {
    setTargetWebName(event.target.value);
  };
  
  // Handle form submit
  const handleSubmit = (event) => {
    event.preventDefault();
    findPlayerByWebName();
  };

    return(
<div className='FPL-Stats'>
      {data && (
        <div>
          <p> Test: {mainData.teams[0].name} - Short Name: {mainData.teams[0].short_name} - Strength: {mainData.teams[0].strength} </p>
          <p>Test: {mainData.teams[19].name} - Short Name: {mainData.teams[19].short_name} - Strength: {mainData.teams[19].strength}</p>
          <p>Player Name: {mainData.elements[400].web_name} - Selected By: {mainData.elements[400].selected_by_percent}% - Total Points: {mainData.elements[400].total_points}</p>
          <p>Player Name: {mainData.elements[144].web_name} - Selected By: {mainData.elements[144].selected_by_percent}% - Total Points: {mainData.elements[144].total_points}</p>
          <p>Player Name: {mainData.elements[18].web_name} - Selected By: {mainData.elements[18].selected_by_percent}% - Total Points: {mainData.elements[18].total_points}</p>
          <img src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${451340}.png`} alt="Mitoma" />
          <img src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${176297}.png`} alt="Rashford" />
          <img src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${223340}.png`} alt="Saka" />
          <img src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${77794}.png`} alt="Trippier" />
          <img src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${172780}.png`} alt="Maddison" />
        </div>
       )}
 
    <form onSubmit={handleSubmit}>
        <h2>Player Searcher!</h2>
           <label>
              Type Player Name Here:
              <input type="text" value={targetWebName} onChange={handleInputChange} />
            </label>
          <button type="submit">Find Player</button>
      </form>

      {targetedPlayer ? (
        <div>
          <img src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${targetedPlayer.code}.png`}
            alt={targetedPlayer.web_name} />
          <p>Player Name: <strong>{targetedPlayer.web_name}</strong> </p>
          <p>Selected By: <strong>{targetedPlayer.selected_by_percent}%</strong></p>    
          <p>Total Points: <strong>{targetedPlayer.total_points}</strong></p>
        </div>
      ) : (
        <p>Player not found.</p>
      )}
    </div>

  
    )
}
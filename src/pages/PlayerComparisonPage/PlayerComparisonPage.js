import React from 'react';
import PlayerComparison from '../../components/playerComparison/playerComparison';
import "./PlayerComparisonPage.css";

const PlayerComparisonPage = ({ data, mainData }) => {
  const elements = mainData && Array.isArray(mainData.elements) ? mainData.elements : [];
  
  const sortedPlayersTotalPoints = [...elements].sort((a, b) => b.total_points - a.total_points);
  const sortedPlayersGWPoints = [...elements].sort((a, b) => b.event_points - a.event_points);
  const sortedPlayersForm = [...elements].sort((a, b) => b.form - a.form);
  const sortedPlayersOwnership = [...elements].sort((a, b) => b.selected_by_percent - a.selected_by_percent);
  const sortedPlayersXGI = [...elements].sort((a, b) => b.expected_goal_involvements - a.expected_goal_involvements);
  const top10Goalkeepers = [...elements].filter(player => player.element_type === 1).sort((a, b) => b.total_points - a.total_points) 
  const top10Defenders = [...elements].filter(player => player.element_type === 2).sort((a, b) => b.total_points - a.total_points) 
  const top10Midfielders = [...elements].filter(player => player.element_type === 3).sort((a, b) => b.total_points - a.total_points) 
  const top10Forwards = [...elements].filter(player => player.element_type === 4).sort((a, b) => b.total_points - a.total_points) 
   
  return (
    <div>
      {/* <div className="player-pics">
        {elements.length > 0 && (
          <div className="pics-wrapper">
            {sortedPlayersGWPoints.slice(0, 10).map((player, index) => (
              <img
                key={player.code}
                className="player-pic-top-10"
                src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${player.code}.png`}
                alt={`player-${index + 1}`}
              />
            ))}
          </div>
        )}
      </div> */}

      <div className="search-sub-heading">
        <p> Not sure who to pick? Compare player stats using the side by side Player Comparison tool or use the Top 10 lists below! </p>
        <p> Type in a player's surname to see a range of FPL stats displayed for them (check spelling / official FPL name if it doesn't display): </p>
      </div>

      <div className="player-comparison-tool">
        <PlayerComparison data={data} mainData={mainData} />
      </div>

      <div className="player-pics player-pics-lists">
        <p className="top-10-title">Top 10 Overall Points</p> 
        {elements.length > 0 && (
          <div className="pics-wrapper">
            {sortedPlayersTotalPoints.slice(0, 10).map((player, index) => (
              <div key={player.code} className="player-pic-container">
                <img
                  className="player-pic-top-10"
                  src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${player.code}.png`}
                  alt={`player-${index + 1}`}
                />
                <p className="player-stat-name">{player.web_name}</p>
                <p className="player-stat">{player.total_points}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="player-pics player-pics-lists">
        <p className="top-10-title">Top 10 Form Players</p> 
        {elements.length > 0 && (
          <div className="pics-wrapper">
            {sortedPlayersForm.slice(0, 10).map((player, index) => (
              <div key={player.code} className="player-pic-container">
                <img
                  className="player-pic-top-10"
                  src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${player.code}.png`}
                  alt={`player-${index + 1}`}
                />
                <p className="player-stat-name">{player.web_name}</p>
                <p className="player-stat">{player.form}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="player-pics player-pics-lists">
        <p className="top-10-title">Top 10 GW Points</p> 
        {elements.length > 0 && (
          <div className="pics-wrapper">
            {sortedPlayersGWPoints.slice(0, 10).map((player, index) => (
              <div key={player.code} className="player-pic-container">
                <img
                  className="player-pic-top-10"
                  src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${player.code}.png`}
                  alt={`player-${index + 1}`}
                />
                <p className="player-stat-name">{player.web_name}</p>
                <p className="player-stat">{player.event_points}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="player-pics player-pics-lists">
        <p className="top-10-title">Top 10 Owned Players</p> 
        {elements.length > 0 && (
          <div className="pics-wrapper">
            {sortedPlayersOwnership.slice(0, 10).map((player, index) => (
              <div key={player.code} className="player-pic-container">
                <img
                  className="player-pic-top-10"
                  src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${player.code}.png`}
                  alt={`player-${index + 1}`}
                />
                <p className="player-stat-name">{player.web_name}</p> 
                <p className="player-stat">{player.selected_by_percent}%</p> 
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="player-pics player-pics-lists">
        <p className="top-10-title">Top 10 xGI (Total Goal Involvements) </p> 
        {elements.length > 0 && (
          <div className="pics-wrapper">
            {sortedPlayersXGI.slice(0, 10).map((player, index) => (
              <div key={player.code} className="player-pic-container">
                <img
                  className="player-pic-top-10"
                  src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${player.code}.png`}
                  alt={`player-${index + 1}`}
                />
                <p className="player-stat-name">{player.web_name}</p>
                <p className="player-stat">{player.expected_goal_involvements}</p>
                <p className="player-stat">({player.goals_scored + player.assists})</p> 
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="player-pics player-pics-lists">
        <p className="top-10-title">Top 10 Goalkeepers</p> 
        {elements.length > 0 && (
          <div className="pics-wrapper">
            {top10Goalkeepers.slice(0, 10).map((player, index) => (
              <div key={player.code} className="player-pic-container">
                <img
                  className="player-pic-top-10"
                  src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${player.code}.png`}
                  alt={`player-${index + 1}`}
                />
                <p className="player-stat-name">{player.web_name}</p>
                <p className="player-stat">{player.total_points}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="player-pics player-pics-lists">
        <p className="top-10-title">Top 10 Defenders</p> 
        {elements.length > 0 && (
          <div className="pics-wrapper">
            {top10Defenders.slice(0, 10).map((player, index) => (
              <div key={player.code} className="player-pic-container">
                <img
                  className="player-pic-top-10"
                  src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${player.code}.png`}
                  alt={`player-${index + 1}`}
                />
                <p className="player-stat-name">{player.web_name}</p>
                <p className="player-stat">{player.total_points}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="player-pics player-pics-lists">
        <p className="top-10-title">Top 10 Midfielders</p> 
        {elements.length > 0 && (
          <div className="pics-wrapper">
            {top10Midfielders.slice(0, 10).map((player, index) => (
              <div key={player.code} className="player-pic-container">
                <img
                  className="player-pic-top-10"
                  src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${player.code}.png`}
                  alt={`player-${index + 1}`}
                />
                <p className="player-stat-name">{player.web_name}</p>
                <p className="player-stat">{player.total_points}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="player-pics player-pics-lists">
        <p className="top-10-title">Top 10 Forwards</p> 
        {elements.length > 0 && (
          <div className="pics-wrapper">
            {top10Forwards.slice(0, 10).map((player, index) => (
              <div key={player.code} className="player-pic-container">
                <img
                  className="player-pic-top-10"
                  src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${player.code}.png`}
                  alt={`player-${index + 1}`}
                />
                <p className="player-stat-name">{player.web_name}</p>
                <p className="player-stat">{player.total_points}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      
    </div>
  );
};

export default PlayerComparisonPage;

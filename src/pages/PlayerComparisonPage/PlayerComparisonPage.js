import React from 'react';
import PlayerComparison from '../../components/playerComparison/playerComparison';
import "./PlayerComparisonPage.css";

const PlayerComparisonPage = ({ data, mainData }) => {
  // Ensure mainData and mainData.elements are defined and are arrays
  const elements = mainData && Array.isArray(mainData.elements) ? mainData.elements : [];

  // Sort the players by event points
  const sortedPlayers = elements.sort((a, b) => b.event_points - a.event_points);

  return (
    <div>
      <div className="player-pics">
        {elements.length > 0 && (
          <div className="pics-wrapper">
            {sortedPlayers.slice(0, 10).map((player, index) => (
              <img
                key={player.code}
                className="player-pic"
                src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${player.code}.png`}
                alt={`player-${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="search-sub-heading">
        <p> Not sure who to pick? Compare player stats using the side by side Player Comparison tool below! </p>
        <p> Type in a player's surname to see a range of FPL stats displayed for them (check spelling / official FPL name if it doesn't display): </p>
      </div>

      <div className="player-comparison-tool">
        <PlayerComparison data={data} mainData={mainData} />
      </div>
    </div>
  );
};

export default PlayerComparisonPage;

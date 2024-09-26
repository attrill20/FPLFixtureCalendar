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
    </div>
  );
};

export default PlayerComparisonPage;

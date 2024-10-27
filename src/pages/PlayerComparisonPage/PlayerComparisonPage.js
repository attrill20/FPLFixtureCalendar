import React from 'react';
import PlayerComparison from '../../components/playerComparison/playerComparison';
import "./PlayerComparisonPage.css";

const PlayerComparisonPage = ({ mainData }) => {
  return (
    <div>
      <div className="search-sub-heading">
        <p> Not sure who to pick? Compare player stats using the side by side Player Comparison tool or use the Top 10 lists below! </p>
        <p> Type in a player's surname to see a range of FPL stats displayed for them (check spelling / official FPL name if it doesn't display): </p>
      </div>

      <div className="player-comparison-tool">
        <PlayerComparison mainData={mainData} />
      </div>
    </div>
  );
};

export default PlayerComparisonPage;
import React from 'react';
import PlayerSearcher from '../../components/playerSearcher/playerSearcher';
import "./PlayerSearcherPage.css";

const PlayerSearcherPage= ({ data, mainData }) => {
  return (
    <div>
      <div className="intro-details">
		{data && (
			<div>
				<img
					className="player-pic"
					src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${480455}.png`}
					alt="Branthwaite"
				/>
				<img
					className="player-pic"
					src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${516895}.png`}
					alt="Mainoo"
				/>
				<img
					className="player-pic"
					src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${219847}.png`}
					alt="Havertz"
				/>
				<img
					className="player-pic"
					src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${178301}.png`}
					alt="Watkins"
				/>
				<img
					className="player-pic"
					src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${219168}.png`}
					alt="Isakr"
				/>
			</div>
		)}
		<div className="sub-heading">
			<p> Not sure who to pick? Compare player stats using the side by side player searcher comparison tool below! </p>
			<p> Type in a player's surname to see a range of FPL stats displayed for them (check spelling / official FPL name if it doesn't display): </p>
		</div>
	</div>
      <PlayerSearcher data={data} mainData={mainData} />
    </div>
  );
};

export default PlayerSearcherPage;

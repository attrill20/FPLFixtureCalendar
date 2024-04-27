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
					src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${451340}.png`}
					alt="Mitoma"
				/>
				<img
					className="player-pic"
					src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${176297}.png`}
					alt="Rashford"
				/>
				<img
					className="player-pic"
					src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${223340}.png`}
					alt="Saka"
				/>
				<img
					className="player-pic"
					src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${85971}.png`}
					alt="Son"
				/>
				<img
					className="player-pic"
					src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${77794}.png`}
					alt="Trippier"
				/>
			</div>
		)}
		<div className="sub-heading">
			<h3> Not sure who to pick? Compare player stats using the side by side comparison tool! </h3>
			<h3> Type in a player's surname below to see a range of FPL stats displayed for them (check spelling / official FPL name if doesn't display): </h3>
		</div>
	</div>
      <PlayerSearcher data={data} mainData={mainData} />
    </div>
  );
};

export default PlayerSearcherPage;

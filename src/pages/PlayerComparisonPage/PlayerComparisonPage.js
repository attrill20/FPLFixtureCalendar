// import React from 'react';
// import PlayerComparison from '../../components/playerComparison/playerComparison';
// import "./PlayerComparisonPage.css";

// const PlayerComparisonPage= ({ data, mainData }) => {
//   return (
//     <div>
//       <div className="player-pics">
// 		{data && (
// 			<div>
// 				<img
// 					className="player-pic"
// 					src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${480455}.png`}
// 					alt="Branthwaite"
// 				/>
// 				<img
// 					className="player-pic"
// 					src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${516895}.png`}
// 					alt="Mainoo"
// 				/>
// 				<img
// 					className="player-pic"
// 					src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${219847}.png`}
// 					alt="Havertz"
// 				/>
// 				<img
// 					className="player-pic"
// 					src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${178301}.png`}
// 					alt="Watkins"
// 				/>
// 				<img
// 					className="player-pic"
// 					src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${219168}.png`}
// 					alt="Isakr"
// 				/>
// 				<img
// 					className="player-pic"
// 					src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${178301}.png`}
// 					alt="Watkins"
// 				/>
// 				<img
// 					className="player-pic"
// 					src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${219168}.png`}
// 					alt="Isakr"
// 				/>
// 				<img
// 					className="player-pic"
// 					src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${219168}.png`}
// 					alt="Isakr"
// 				/>
// 				<img
// 					className="player-pic"
// 					src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${178301}.png`}
// 					alt="Watkins"
// 				/>
// 				<img
// 					className="player-pic"
// 					src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${219168}.png`}
// 					alt="Isak"
// 				/>
// 			</div>
// 		)}
// 	</div>
// 	<div className="search-sub-heading">
// 		<p> Not sure who to pick? Compare player stats using the side by side Player Comparison tool below! </p>
// 		<p> Type in a player's surname to see a range of FPL stats displayed for them (check spelling / official FPL name if it doesn't display): </p>
// 	</div>
// 	<div className="player-comparison-tool">
// 		<PlayerComparison data={data} mainData={mainData} />
// 	</div>
      
//     </div>
//   );
// };

// export default PlayerComparisonPage;


import React from 'react';
import PlayerComparison from '../../components/playerComparison/playerComparison';
import "./PlayerComparisonPage.css";

const PlayerComparisonPage = ({ data, mainData }) => {

  // Sort the players by event points
  const sortedPlayers = mainData.elements.sort((a, b) => b.event_points - a.event_points);

  return (
    <div>
      <div className="player-pics">
        {data && (
          <div>
          	<img
				className="player-pic"
				src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${sortedPlayers[0].code}.png`}
				alt="player-1"
			/>
			<img
				className="player-pic"
				src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${sortedPlayers[1].code}.png`}
				alt="player-2"
			/>
			<img
				className="player-pic"
				src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${sortedPlayers[2].code}.png`}
				alt="player-3"
			/>
			<img
				className="player-pic"
				src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${sortedPlayers[3].code}.png`}
				alt="player-4"
			/>
			<img
				className="player-pic"
				src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${sortedPlayers[4].code}.png`}
				alt="player-5"
			/>
			<img
				className="player-pic"
				src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${sortedPlayers[5].code}.png`}
				alt="player-6"
			/>
			<img
				className="player-pic"
				src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${sortedPlayers[6].code}.png`}
				alt="player-7"
			/>
			<img
				className="player-pic"
				src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${sortedPlayers[7].code}.png`}
				alt="player-8"
			/>
			<img
				className="player-pic"
				src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${sortedPlayers[8].code}.png`}
				alt="player-9"
			/>
			<img
				className="player-pic"
				src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${sortedPlayers[9].code}.png`}
				alt="player-10"
			/>
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

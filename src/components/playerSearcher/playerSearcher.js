import React, { useState } from "react";
import FormResults from "./formResults/formResults";
import Checkboxes from "./checkboxes/checkboxes";
import "./playerSearcher.css";

export default function PlayerSearcher({ data, mainData }) {
	const [targetedPlayer, setTargetedPlayer] = useState(null);
	const [targetWebName, setTargetWebName] = useState("");
	const [targetedPlayer2, setTargetedPlayer2] = useState(null);
	const [targetWebName2, setTargetWebName2] = useState("");

	const [showGoals, setShowGoals] = useState(false);
	const [showAssists, setShowAssists] = useState(false);

	function reverseNormalize(name) {
		const specialChars = {
		  'ø': 'o',
		  'Ø': 'O',
		  'æ': 'ae',
		  'Æ': 'AE',
		  'å': 'a',
		  'Å': 'A',
		  // Add more special characters and their ASCII equivalents as needed
		};
	  
		return name.replace(/[øØæÆåÅ]/g, char => specialChars[char] || char);
	  }
	  
	  const findPlayerByWebName = (webName) => {
		const normalizedWebName = reverseNormalize(webName);
		const lowercaseWebName = normalizedWebName.toLowerCase();
		
		const player = mainData.elements.find(
		  (player) => reverseNormalize(player.web_name).toLowerCase() === lowercaseWebName
		);
		
		return player;
	  };

	// First instance - Handle input change for the web name
	const handleInputChange = (event) => {
		setTargetWebName(event.target.value);
	};

	const handleSubmit = (event, setTargetedPlayer, targetWebName) => {
		event.preventDefault();
		const player = findPlayerByWebName(targetWebName);
		setTargetedPlayer(player);
	};

	return (
		<div>
			<Checkboxes
				showGoals={showGoals}
				showAssists={showAssists}
				setShowGoals={setShowGoals}
				setShowAssists={setShowAssists}
			/>
			
			<div className="fpl-stats">
				<FormResults
					targetWebName={targetWebName}
					setTargetWebName={setTargetWebName}
					handleSubmit={(event) => handleSubmit(event, setTargetedPlayer, targetWebName)}
					targetedPlayer={targetedPlayer}
					mainData={mainData}
					showGoals={showGoals}
					showAssists={showAssists}
				/>

				<FormResults
					targetWebName={targetWebName2}
					setTargetWebName={setTargetWebName2}
					handleSubmit={(event) => handleSubmit(event, setTargetedPlayer2, targetWebName2)}
					targetedPlayer={targetedPlayer2}
					mainData={mainData}
					showGoals={showGoals}
					showAssists={showAssists}
				/>
			</div>
		</div>
	);
}





// import React, { useState } from "react";
// import Checkboxes from "./checkboxes/checkboxes";
// import "./playerSearcher.css";

// export default function PlayerSearcher({ data, mainData }) {
// 	const [targetedPlayer, setTargetedPlayer] = useState(null);
// 	const [targetWebName, setTargetWebName] = useState("");
// 	const [targetedPlayer2, setTargetedPlayer2] = useState(null); 
// 	const [targetWebName2, setTargetWebName2] = useState(""); 

// 	const [showGoals, setShowGoals] = useState(false);
// 	const [showAssists, setShowAssists] = useState(false);

// 	// First instance - Function to target a player by their web name
// 	const findPlayerByWebName = () => {
// 		const lowercaseTargetWebName = targetWebName.toLowerCase();
// 		const targetedPlayer = mainData.elements.find(
// 			(player) => player.web_name.toLowerCase() === lowercaseTargetWebName
// 		);
// 		setTargetedPlayer(targetedPlayer);
// 	};

// 	// Second instance - Function to target a player by their web name
// 	const findPlayerByWebName2 = () => {
// 		const lowercaseTargetWebName = targetWebName2.toLowerCase();
// 		const targetedPlayer = mainData.elements.find(
// 			(player) => player.web_name.toLowerCase() === lowercaseTargetWebName
// 		);
// 		setTargetedPlayer2(targetedPlayer);
// 	};

// 	// First instance - Handle input change for the web name
// 	const handleInputChange = (event) => {
// 		setTargetWebName(event.target.value);
// 	};

// 	// Second instance - Handle input change for the web name
// 	const handleInputChange2 = (event) => {
// 		setTargetWebName2(event.target.value);
// 	};

// 	// First instance - Handle form submit
// 	const handleSubmit = (event) => {
// 		event.preventDefault();
// 		findPlayerByWebName();
// 	};

// 	// Second instance - Handle form submit
// 	const handleSubmit2 = (event) => {
// 		event.preventDefault();
// 		findPlayerByWebName2();
// 	};

// 	return (
// 		<div className="fpl-stats">
// 			<div className="player-searcher">
// 				<form
// 					className="form"
// 					onSubmit={handleSubmit}>
// 					<label className="form-label">
// 						Enter Player Name Here:
// 						<input
// 							className="form-input"
// 							type="text"
// 							value={targetWebName}
// 							onChange={handleInputChange}
// 						/>
// 					</label>
// 					<button className='submit-button' type="submit">Find Player</button>
// 				</form>

// 				<div className="results-wrapper">
// 				{targetedPlayer ? (
// 					<div className="results">
// 						<img
// 							className="player-pic2"
// 							src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${targetedPlayer.code}.png`}
// 							alt={targetedPlayer.web_name}
// 						/>
// 						<p>
// 							Name: <strong>{targetedPlayer.first_name} {targetedPlayer.second_name}</strong>
// 							<br />Team: <strong>{mainData.teams[targetedPlayer.team - 1].name}</strong>
// 						</p>
// 						<p>
// 							Selected By: <strong>{targetedPlayer.selected_by_percent}%</strong>
// 							<br />Cost: <strong>{(targetedPlayer.now_cost / 10).toFixed(1)}m</strong>
// 						</p>

// 						<p>
// 							Total Points: <strong>{targetedPlayer.total_points}</strong>
// 							<br />Form: <strong>{targetedPlayer.form}</strong>
// 							<br />xGI per 90: <strong>{targetedPlayer.expected_goal_involvements_per_90}</strong>
// 						</p>

// 						<p>
// 						{showGoals && (
// 							<p>Goals: <strong>{targetedPlayer.goals_scored}</strong></p>
//                             )}
// 						{showAssists && (
// 							<p>Assists: <strong>{targetedPlayer.assists}</strong></p>
// 							)}
// 						</p>
// 					</div>
// 				) : (
// 					<p className="results">Player not found - try again!</p>
// 				)}
// 				</div>
// 			</div>
		
// 			<div className="player-searcher">
// 				<form
// 					className="form"
// 					onSubmit={handleSubmit2}>
// 					<label className="form-label">
// 						Enter Player Name Here:
// 						<input
// 							className="form-input"
// 							type="text"
// 							value={targetWebName2}
// 							onChange={handleInputChange2}
// 						/>
// 					</label>
// 					<button className='submit-button' type="submit">Find Player</button>
// 				</form>

// 			<div className="results-wrapper">
// 				{targetedPlayer2 ? (
// 					<div className="results">
// 						<img
// 							className="player-pic2"
// 							src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${targetedPlayer2.code}.png`}
// 							alt={targetedPlayer2.web_name}
// 						/>
// 						<p>
// 							Name: <strong>{targetedPlayer2.first_name} {targetedPlayer2.second_name}</strong>
// 							<br />Team: <strong>{mainData.teams[targetedPlayer2.team - 1].name}</strong>
// 						</p>
// 						<p>
// 						Selected By: <strong>{targetedPlayer2.selected_by_percent}%</strong>
// 						<br />Cost: <strong>{(targetedPlayer2.now_cost / 10).toFixed(1)}m</strong>
// 						</p>
						
// 						<p>
// 							Total Points: <strong>{targetedPlayer2.total_points}</strong>
// 							<br />Form: <strong>{targetedPlayer2.form}</strong>
// 							<br />xGI per 90: <strong>{targetedPlayer2.expected_goal_involvements_per_90}</strong>
// 						</p>
// 					</div>
// 				) : (
// 					<p className="results">Player not found - try again!</p>
// 				)}
// 				</div>
// 			</div>
// 		</div>
// 	);
// }
